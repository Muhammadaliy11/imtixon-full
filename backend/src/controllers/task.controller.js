const Task = require("../models/task.model");

// GET /api/tasks - Barcha vazifalarni olish
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id - Bitta vazifani olish
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    // Foydalanuvchi tekshiruvi
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    return res.status(200).json({
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks - Yangi vazifa yaratish
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        statusCode: 400,
        message: "Sarlavha majburiy",
      });
    }

    const taskData = {
      userId: req.user.userId,
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "MEDIUM",
      status: "TODO",
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await Task.create(taskData);

    return res.status(201).json({
      data: task,
      message: "Vazifa muvaffaqiyatli yaratildi",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id - Vazifani yangilash
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    // Foydalanuvchi tekshiruvi
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Faqat kelgan maydonlarni yangilash
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();

    return res.status(200).json({
      data: task,
      message: "Vazifa muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id - Vazifani o'chirish
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    // Foydalanuvchi tekshiruvi
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Vazifa muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/status - Status yangilash
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        statusCode: 400,
        message: "Status kiritilishi shart",
      });
    }

    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Status noto'g'ri qiymatga ega",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        statusCode: 404,
        message: "Vazifa topilmadi",
      });
    }

    // Foydalanuvchi tekshiruvi
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        statusCode: 403,
        message: "Bu vazifaga ruxsatingiz yo'q",
      });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      data: task,
      message: "Vazifa holati yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
