# 🚀 Deploy Yo'riqnomasi

## 📦 Talablar
- GitHub akkaunt
- Render akkaunt (https://render.com)
- Vercel akkaunt (https://vercel.com)
- MongoDB Atlas (allaqachon o'rnatilgan)

---

## 🔴 1. Backend — Render ga deploy

### 1.1 GitHub ga yuklash

```bash
cd c:\Imtixon\backend
git init
git add .
git commit -m "Backend initial commit"
```

GitHub da yangi repository yaratib, push qiling:
```bash
git remote add origin https://github.com/your-username/task-manager-backend.git
git branch -M main
git push -u origin main
```

### 1.2 Render da Web Service yaratish

1. **Render.com** ga kiring: https://dashboard.render.com/
2. **New +** → **Web Service** bosing
3. GitHub repository ni ulang va backend repo ni tanlang
4. Quyidagi ma'lumotlarni to'ldiring:

**Basic settings:**
- **Name**: `task-manager-api` (yoki o'zingizga yoqqan nom)
- **Region**: Frankfurt (yoki yaqin region)
- **Branch**: `main`
- **Root Directory**: `.` (yoki bo'sh qoldiring)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node src/app.js`

**Plan:**
- **Free** rejani tanlang

### 1.3 Environment Variables (Render)

**Environment** bo'limida quyidagilarni qo'shing:

```
MONGO_URI=mongodb+srv://holiqovmali_db_user:cavmKjirjin7Lbx0@cluster0.ca8zqid.mongodb.net/?appName=Cluster0

JWT_ACCESS_SECRET=kasdjf9823hdkajsdf7823hkdjf823hkjdf823h

JWT_REFRESH_SECRET=sdkfjh23kj4h23kj4h23kj4h23kjh4k23jh4kjh

JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=https://your-vercel-app.vercel.app
```

> ⚠️ **Muhim**: JWT secretlarni xavfsiz qilib o'zgartiring!

### 1.4 Deploy

- **Create Web Service** bosing
- Deploy jarayoni 2-3 daqiqa davom etadi
- Tayyor bo'lgach URL olasiz: `https://task-manager-api-xxxx.onrender.com`

**✅ Backend URL ni yozib qo'ying — frontend uchun kerak bo'ladi!**

---

## 🔵 2. Frontend — Vercel ga deploy

### 2.1 GitHub ga yuklash

```bash
cd c:\Imtixon\frontend
git init
git add .
git commit -m "Frontend initial commit"
```

GitHub da yangi repository yaratib, push qiling:
```bash
git remote add origin https://github.com/your-username/task-manager-frontend.git
git branch -M main
git push -u origin main
```

### 2.2 `.env.production` ni yangilash

**MUHIM**: Deploy qilishdan oldin `.env.production` ni yangilang:

```
VITE_API_URL=https://task-manager-api-xxxx.onrender.com/api
```

> ☝️ Yuqoridagi `task-manager-api-xxxx` ni o'zingizning Render URL bilan almashtiring!

Commit qiling:
```bash
git add .env.production
git commit -m "Update production API URL"
git push
```

### 2.3 Vercel da deploy qilish

1. **Vercel.com** ga kiring: https://vercel.com/
2. **Add New** → **Project** bosing
3. GitHub repository ni import qiling (frontend repo)
4. Quyidagi ma'lumotlarni tekshiring:

**Build & Development Settings:**
- **Framework Preset**: `Vite` (avtomatik aniqlanadi)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)
- **Install Command**: `npm install` (default)

**Environment Variables** (Vercel):

```
VITE_API_URL=https://task-manager-api-xxxx.onrender.com/api
```

> ✅ Bu avtomatik `.env.production` dan olinadi, lekin tekshirib ko'ring.

5. **Deploy** bosing

Deploy tugagach URL olasiz: `https://task-manager-frontend.vercel.app`

---

## 🔄 3. Backend CORS ni yangilash

**Render dashboard** ga qayting:

1. **Environment** tabga o'ting
2. `FRONTEND_URL` ni yangilang:
   ```
   FRONTEND_URL=https://task-manager-frontend.vercel.app
   ```
3. **Save Changes** bosing — server avtomatik restart bo'ladi

---

## ✅ 4. Test qilish

1. Vercel URL ni oching: `https://task-manager-frontend.vercel.app`
2. Register sahifasidan ro'yxatdan o'ting
3. Login qiling
4. Vazifa yaratib ko'ring

---

## 🐛 Muammolar va yechimlar

### Backend ishlamayapti?
- Render dashboard → **Logs** bo'limida xatolarni ko'ring
- MongoDB Atlas da IP whitelist: **0.0.0.0/0** qo'shing (barcha IP lardan ruxsat)

### CORS xatosi?
- `FRONTEND_URL` to'g'ri kiritilganligini tekshiring
- Slash (`/`) bilan tugamasligi kerak: ❌ `https://...vercel.app/` → ✅ `https://...vercel.app`

### Frontend API ga ulana olmayapti?
- `.env.production` dagi `VITE_API_URL` to'g'ri ekanligini tekshiring
- `/api` bilan tugashi shart: `https://your-render-url.onrender.com/api`

### Render Free plan - "Cold start"
- Free rejada server 15 daqiqa ishlamasa, uyqu rejimiga o'tadi
- Birinchi so'rov 30-60 soniya kutishi mumkin — bu normal

---

## 📝 Qo'shimcha

### Render URL:
```
https://task-manager-api-xxxx.onrender.com
```

### Vercel URL:
```
https://task-manager-frontend.vercel.app
```

### MongoDB Atlas:
```
mongodb+srv://holiqovmali_db_user:***@cluster0.ca8zqid.mongodb.net/
```

---

## 🎉 Tayyor!

Endi to'liq ishlayotgan fullstack ilova internet orqali ochiq!
