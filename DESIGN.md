---
name: Bento Pro
colors:
  primary: "#F9A474"
  accent-secondary: "#c3a3ff"
  accent-success: "#59d9a6"
  accent-warning: "#f4bf63"
  accent-danger: "#ff7d8b"
  background: "#0a0a0a"
  surface: "#0a0a0a"
  border-default: "rgba(255, 255, 255, 0.10)"
  border-strong: "rgba(255, 255, 255, 0.20)"
  text-primary: "#ffffff"
  text-secondary: "#a1a1aa"
  text-muted: "#71717a"
typography:
  fontFamily: "Inter, sans-serif"
  fontFamily-display: "Inter Tight, Inter, sans-serif"
  fontFamily-mono: "JetBrains Mono, monospace"
  h1: { fontSize: "44px", fontWeight: 600, lineHeight: 1.1 }
  h2: { fontSize: "34px", fontWeight: 600, lineHeight: 1.2 }
  h3: { fontSize: "26px", fontWeight: 560, lineHeight: 1.2 }
  body-md: { fontSize: "17px", fontWeight: 420, lineHeight: 1.6 }
  label-sm: { fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }
rounded:
  sm: "8px"
  md: "16px"
  lg: "32px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "28px"
    border: "1px solid {colors.border-default}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#1a120d"
    rounded: "32px"
    padding: "10px 16px"
---

# Mini Ticketbox - Bento Pro Design Spec

## Overview
Dự án Mini Ticketbox sử dụng chủ đề thiết kế **Bento Pro** cao cấp, tối giản nhưng đậm chất tạp chí với hệ thống lưới bất đối xứng và điểm nhấn ánh sáng tinh tế.
- **Audience**: Nhóm người dùng yêu thích sự thanh lịch, công nghệ cao và cao cấp.
- **Mood**: Tối giản đen sâu (Pure Black), trực quan Bento, sắc sảo.

## Colors
- **Canvas background (#0a0a0a)**: Đen thuần khiết tạo chiều sâu vô hạn.
- **Brand Primary (#F9A474)**: Màu cam ấm/san hô làm điểm nhấn chủ đạo cho các tương tác cốt lõi.
- **Bento Borders (rgba(255, 255, 255, 0.10))**: Đường viền mảnh màu trắng bán trong suốt để phân chia các khối.

## Typography
- Font chữ hiển thị: **Inter Tight** & **Inter** tạo cảm giác hiện đại, sắc nét.

## Do's and Don'ts
- **DO**: Sử dụng card bo góc lớn (`rounded.lg` 32px cho desktop) và hover có hiệu ứng nhấc nổi nhẹ (+4px) kết hợp viền sáng.
- **DO**: Đảm bảo các trạng thái của nút bấm đều có hiệu ứng glint phản quang tinh tế.
- **DON'T**: Sử dụng màu nền sáng hoặc màu xám trung tính cho văn bản chính.
