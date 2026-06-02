const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Token generatsiya qilish yordamchi funksiyasi
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: "access" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Validatsiya
    if (!fullName || !email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Barcha maydonlar to'ldirilishi shart",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        statusCode: 400,
        message: "Parol kamida 6 ta belgi bo'lishi kerak",
      });
    }

    // Email takrorlanishini tekshirish
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }

    // Parolni hash qilish
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Yangi foydalanuvchi yaratish
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    // Tokenlar generatsiya qilish
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Refresh tokenni saqlash
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email va parol kiritilishi shart",
      });
    }

    // Foydalanuvchini topish
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Email yoki parol noto'g'ri",
      });
    }

    // Parolni tekshirish
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Email yoki parol noto'g'ri",
      });
    }

    // Tokenlar generatsiya qilish
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Refresh tokenni yangilash
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Refresh token topilmadi",
      });
    }

    // Refresh tokenni tekshirish
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          statusCode: 401,
          message: "Token muddati tugagan",
        });
      }
      return res.status(401).json({
        statusCode: 401,
        message: "Tizimga kiring",
      });
    }

    // Foydalanuvchini topish va token mosligini tekshirish
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Tizimga kiring",
      });
    }

    // Yangi tokenlar generatsiya qilish
    const tokens = generateTokens(user._id);

    // Yangi refresh tokenni saqlash
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    // Foydalanuvchining refresh tokenini o'chirish
    const user = await User.findById(req.user.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return res.status(200).json({
      message: "Tizimdan chiqdingiz",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout };
