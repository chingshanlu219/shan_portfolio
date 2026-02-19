# Shan Portfolio

個人作品集網站，類似 [九典聯合建築師事務所](https://www.bioarch.com.tw) 風格。

## 功能

- **首頁** (`/homepage`): Marquee 橫向無限輪播 + 6 格 Project 預覽
- **Project** (`/project`): 作品列表與詳情頁
- **Sketch** (`/sketch`): 草圖列表與詳情頁
- **多語系**: 繁中、簡中、英文、法文、西班牙文
- **Admin** (`/admin`): 後台管理，可新增/編輯首頁圖片、Projects、Sketches

## 技術棧

- Next.js 14 (App Router)
- MongoDB
- Cloudinary
- Tailwind CSS
- ReactQuill

## 設定

1. 複製 `.env.example` 為 `.env.local`
2. 填入環境變數：
   - `MONGODB_URI`: MongoDB 連線字串
   - `ADMIN_PASSWORD`: 管理員密碼
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## 開發

```bash
npm install
npm run dev
```

## 部署

```bash
npm run build
npm start
```
