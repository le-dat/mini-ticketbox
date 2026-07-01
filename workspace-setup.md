# Kế hoạch triển khai: Khởi tạo Workspace & Docker Containerization

## 📋 Overview
Khởi tạo cấu trúc Monorepo skeleton cho dự án `mini-ticketbox` bao gồm Backend (NestJS), Frontend (React Vite + TailwindCSS v4), Database (PostgreSQL) và thiết lập môi trường Docker chạy local.

- **Project Type:** MONOREPO (WEB + BACKEND)
- **Primary Agent:** `devops-engineer` + `backend-specialist` + `frontend-specialist`

---

## 🎯 Success Criteria
1. Cấu trúc thư mục monorepo hoàn chỉnh: `backend/`, `frontend/`, `docker-compose.yml`.
2. NestJS Backend được khởi tạo và chạy thành công trên port `3000` thông qua Docker.
3. React Frontend (Vite) được khởi tạo với TailwindCSS v4, chạy thành công trên port `5173` thông qua Docker.
4. Database PostgreSQL chạy độc lập trên port `5432` và kết nối thành công từ backend.
5. Lệnh khởi chạy duy nhất: `docker-compose up --build` chạy được toàn bộ hệ thống.

---

## 🛠️ Tech Stack
- **Backend Framework:** NestJS (v10+) & TypeScript.
- **Frontend Framework:** React 19 (Vite) & TypeScript.
- **CSS Framework:** TailwindCSS v4 (sử dụng `@tailwindcss/vite` plugin cho Vite).
- **Database:** PostgreSQL v15.
- **Containerization:** Docker & Docker Compose.

---

## 📂 File Structure
```
nam-viet/
├── backend/
│   ├── Dockerfile
│   └── ... (NestJS files)
├── frontend/
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── ... (React Vite files)
├── docker-compose.yml
├── workspace-setup.md (File kế hoạch này)
└── README.md
```

---

## ⚠️ User Review Required
> [!IMPORTANT]
> **Hot-Reloading in Docker Compose:** Cấu hình Docker Compose mặc định trong hướng dẫn chưa gắn host volume cho `backend/` và `frontend/`. Để hỗ trợ code thay đổi cập nhật lập tức trên Docker (hot-reloading) mà không cần build lại container, đề xuất gắn volumes:
> - Backend: `- ./backend:/app` và loại trừ `node_modules`
> - Frontend: `- ./frontend:/app` và loại trừ `node_modules`

> [!WARNING]
> **Vite Host binding:** React Vite theo mặc định chỉ bind với `localhost` bên trong container nên host máy ảo/thực bên ngoài không truy cập được. Chúng tôi sẽ sửa lệnh khởi chạy trong Frontend Dockerfile thành `npm run dev -- --host` để lắng nghe từ mọi card mạng `0.0.0.0`.

---

## ❓ Open Questions
> [!IMPORTANT]
> 1. Bạn có muốn cấu hình **Hot-reloading (Volumes mounting)** trực tiếp vào file `docker-compose.yml` cho NestJS và React ngay từ đầu không?
> 2. Có cần thiết lập file cấu hình môi trường `.env` mẫu (`.env.example`) ở root directory để quản lý các biến PostgreSQL credentials không?

---

## 📑 Task Breakdown

### Phase 1: Foundation (Cơ sở hạ tầng & Database)
- **Task 1.1: Khởi tạo khung thư mục & file `.gitignore`**
  - **Agent:** `devops-engineer`
  - **Skill:** `clean-code`
  - **Priority:** High
  - **Dependencies:** None
  - **INPUT:** Dự án trống.
  - **OUTPUT:** Thư mục root chứa `.gitignore`.
  - **VERIFY:** `ls -la` hiển thị các thư mục chuẩn bị khởi tạo.

- **Task 1.2: Thiết lập Postgres Database Container**
  - **Agent:** `database-architect`
  - **Skill:** `database-design`
  - **Priority:** High
  - **Dependencies:** Task 1.1
  - **INPUT:** Cấu hình postgres trong `docker-compose.yml`.
  - **OUTPUT:** `docker-compose.yml` chứa service `postgres`.
  - **VERIFY:** Chạy thử `docker compose up -d postgres` thành công và kết nối được vào port 5432.

### Phase 2: Core (NestJS Backend)
- **Task 2.1: Khởi tạo dự án NestJS mới**
  - **Agent:** `backend-specialist`
  - **Skill:** `api-patterns`
  - **Priority:** High
  - **Dependencies:** Task 1.1
  - **INPUT:** Lệnh khởi tạo NestJS CLI.
  - **OUTPUT:** Thư mục `backend/` chứa skeleton code của NestJS.
  - **VERIFY:** File `backend/package.json` và cấu trúc cơ bản đã được tạo.

- **Task 2.2: Cấu hình dependencies cho Backend**
  - **Agent:** `backend-specialist`
  - **Skill:** `api-patterns`
  - **Priority:** Medium
  - **Dependencies:** Task 2.1
  - **INPUT:** Cài đặt các thư viện `@nestjs/config`, `@nestjs/websockets`, `pg`, v.v.
  - **OUTPUT:** Thư mục `backend/node_modules` có chứa các thư viện trên.
  - **VERIFY:** `backend/package.json` chứa các dependencies vừa cài đặt.

- **Task 2.3: Tạo Dockerfile cho Backend**
  - **Agent:** `devops-engineer`
  - **Skill:** `clean-code`
  - **Priority:** High
  - **Dependencies:** Task 2.2
  - **INPUT:** Cấu hình Docker cho Node/NestJS.
  - **OUTPUT:** File `backend/Dockerfile`.
  - **VERIFY:** Build thử image backend bằng `docker build -t test-backend ./backend` thành công.

### Phase 3: UI/UX (React Frontend)
- **Task 3.1: Khởi tạo dự án React Vite mới**
  - **Agent:** `frontend-specialist`
  - **Skill:** `frontend-design`
  - **Priority:** High
  - **Dependencies:** Task 1.1
  - **INPUT:** Lệnh khởi tạo Vite template `react-ts`.
  - **OUTPUT:** Thư mục `frontend/` chứa skeleton code của React Vite.
  - **VERIFY:** Có file `frontend/package.json` và chạy thử được `npm run dev` trên local.

- **Task 3.2: Tích hợp TailwindCSS v4 và Socket.io-client**
  - **Agent:** `frontend-specialist`
  - **Skill:** `tailwind-patterns`
  - **Priority:** High
  - **Dependencies:** Task 3.1
  - **INPUT:** Cài đặt `@tailwindcss/vite`, `tailwindcss`, `socket.io-client` và cấu hình CSS-first cho Tailwind v4.
  - **OUTPUT:** `frontend/vite.config.ts` chứa `@tailwindcss/vite` plugin và `frontend/src/index.css` chứa `@import "tailwindcss";`.
  - **VERIFY:** Thử dùng một utility class (ví dụ `text-red-500`) trên UI hiển thị chính xác.

- **Task 3.3: Tạo Dockerfile cho Frontend**
  - **Agent:** `devops-engineer`
  - **Skill:** `clean-code`
  - **Priority:** High
  - **Dependencies:** Task 3.2
  - **INPUT:** Cấu hình Docker cho Vite React.
  - **OUTPUT:** File `frontend/Dockerfile` có expose port 5173 và chạy `--host`.
  - **VERIFY:** Build thử image frontend bằng `docker build -t test-frontend ./frontend` thành công.

### Phase 4: Integration (Docker Compose)
- **Task 4.1: Hoàn thiện `docker-compose.yml` ở thư mục gốc**
  - **Agent:** `devops-engineer`
  - **Skill:** `clean-code`
  - **Priority:** High
  - **Dependencies:** Task 2.3, Task 3.3, Task 1.2
  - **INPUT:** Cấu hình kết hợp cả 3 service.
  - **OUTPUT:** File `docker-compose.yml` hoàn chỉnh.
  - **VERIFY:** Chạy lệnh `docker-compose up --build` không gặp lỗi.

---

## 🏁 Phase X: Verification (Quy trình kiểm thử & Nghiệm thu)

### Automated Tests & Checks
- Chạy kiểm tra định dạng và chất lượng code:
  ```bash
  # P0: Kiểm tra bảo mật
  python .agents/skills/vulnerability-scanner/scripts/security_scan.py .
  ```

### Manual Verification
1. Khởi chạy toàn bộ hệ thống qua Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. Xác minh các cổng truy cập:
   - Backend NestJS mặc định: [http://localhost:3000](http://localhost:3000) phản hồi "Hello World".
   - Frontend React Vite mặc định: [http://localhost:5173](http://localhost:5173) hoạt động và tải được styles TailwindCSS v4.
   - Kết nối cơ sở dữ liệu: Dùng công cụ quản lý DB (như DBeaver hoặc pgAdmin) kết nối qua `localhost:5432` với user `ticketbox_user` thành công.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues in project code
- Build: ✅ Success (Backend & Frontend successfully compiled)
- Date: 2026-07-01
