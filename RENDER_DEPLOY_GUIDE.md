# 🚀 AeroSport Platform — Render 24/7 Deployment Guide

Loyiha Render platformasida 24/7 uzluksiz ishlashga to'liq tayyorlandi. Frontend va Backend bitta to'liq Web Service sifatida Render'da joylashadi va MongoDB Atlas bilan ishlaydi.

---

## 🛠️ Tayyorlangan Funksiyalar
* **Bitta Web Service:** Express server ham frontendni (`dist/`), ham barcha API'larni (`/api/*`) xizmat ko'rsatadi.
* **CORS muammosi yo'q:** Bir xil domen va portda ishlaydi.
* **Express 5 SPA Fallback:** Istalgan sahifa (`/shop`, `/events`, `/chat`) brauzerda to'g'ridan-to'g'ri yangilanganda ham 404 bermaydi.
* **MongoDB Atlas ulanishi:** `mongodb+srv://sensey:Tz02wW4baigi38jQ@hakaton-sensey.uklgntq.mongodb.net/sportshub` bazasiga avtomatik ulanadi.
* **render.yaml mavjud:** Render Blueprint orqali 1-klikda joylashtirish mumkin.
* **24/7 Self-Ping Keep-Alive:** Render'ning bepul tarifi 15 daqiqadan so'ng uxlab qolmasligi uchun server har 10 daqiqada o'zini o'zi uyg'otib turadi (`RENDER_EXTERNAL_URL` orqali).

---

## 1-Qadam: GitHub'ga Yuklash

Terminalda loyiha papkasida quyidagi buyruqlarni bajaring:

```bash
git init
git add .
git commit -m "feat: complete sports platform ready for 24/7 Render deployment"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/SIZNING_REPO.git
git push -u origin main
```

*(Eslatma: `.gitignore` to'g'ri sozlangan, ortiqcha `node_modules` va maxfiy kalitlar yuklanmaydi)*

---

## 2-Qadam: Render'da Joylashtirish (2 xil usul)

### Usul 1: Blueprint orqali (Eng oson, tavsiya etiladi ⚡)
1. [dashboard.render.com](https://dashboard.render.com/) ga kiring.
2. **"New +"** tugmasini bosing va **"Blueprint"** ni tanlang.
3. GitHub'dagi repozitoriyangizni ulang.
4. Render avtomatik ravishda `render.yaml` faylini aniqlaydi va hamma narsani (Build command, Start command, Environment variables) o'zi sozlaydi.
5. **"Apply"** tugmasini bosing.

---

### Usul 2: Qo'lda Web Service yaratish
1. [dashboard.render.com](https://dashboard.render.com/) ga kiring.
2. **"New +"** -> **"Web Service"** ni tanlang.
3. Repozitoriyangizni ulang.
4. Quyidagi parametrlarni kiriting:
   * **Name:** `aerosport-platform` (yoki xohlagan nomingiz)
   * **Region:** `Frankfurt (EU Central)`
   * **Branch:** `main`
   * **Root Directory:** *(bo'sh qoldiring)*
   * **Runtime:** `Node`
   * **Build Command:** `npm run render-build`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`

5. **"Environment Variables"** bo'limiga quyidagilarni qo'shing:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://sensey:Tz02wW4baigi38jQ@hakaton-sensey.uklgntq.mongodb.net/sportshub?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `super_secret_sportshub_jwt_key_2026_fitness_pro` |

6. **"Deploy Web Service"** tugmasini bosing.

---

## 3-Qadam: Saytni 24/7 Doimiy Ishlashini Ta'minlash (Never Sleep)

Render'ning bepul tarifi 15 daqiqa foydalanuvchi kirmasa, serverni uxlab qolish (spin down) holatiga o'tkazadi. Buning oldini olish uchun 2 ta usul kiritilgan:

### A) Avtomatik Ichki Ping (Dastur ichiga kiritilgan)
Render ishga tushganda `RENDER_EXTERNAL_URL` ni aniqlaydi va har **10 daqiqada** o'zining `/api/health` manziliga so'rov yuborib turadi. Bu serverni doimo faol saqlaydi!

### B) Qo'shimcha 100% Bepul Tashqi Uptime Monitor (Kafolatlangan 24/7)
1. [cron-job.org](https://cron-job.org/) yoki [uptimerobot.com](https://uptimerobot.com/) saytiga kiring (ro'yxatdan o'tish bepul).
2. Yangi monitor / cron yaratish:
   * **URL:** `https://sizning-saytingiz.onrender.com/api/health`
   * **Interval:** Har 5 daqiqada yoki 10 daqiqada
3. Bo'ldi! Endi Render serveringiz hech qachon uxlamaydi va tashrif buyuruvchilar kutmasdan bir zumda ochiladi.

---

## 4-Qadam: Tekshirish

Deploy tugagach, Render sizga quyidagicha havola beradi:
* `https://aerosport-platform.onrender.com` — Asosiy sayt va chat
* `https://aerosport-platform.onrender.com/api/health` — API statusi
* Admin panel uchun: saytda `admin@gmail.com` va `adimin12345` orqali kiring!
