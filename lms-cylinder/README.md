# lms-cylinder

## Cấu trúc

- `client/`: React frontend (Vite)
- `server/`: NodeJS backend
- `database/lms.sql`: SQL schema
- `uploads/`: thư mục lưu video/pdf/images

## Chạy backend

```bash
cd server
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken multer
npm install --save-dev nodemon
npm run dev
```

## Chạy frontend

```bash
cd client
npm install
npm install axios react-router-dom
npm run dev
```

## API đã có

- POST `/api/login`
- POST `/api/upload/video`
- GET `/api/courses`
- POST `/api/progress`
- POST `/api/quiz/submit`
