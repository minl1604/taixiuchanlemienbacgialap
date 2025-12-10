# 🎲 Tài Xỉu Miền Bắc - Giả Lập
## Tổng quan
**Tài Xỉu Miền Bắc Giả Lập** là một ứng dụng web client-side mô phỏng "Giải Đặc Biệt" của Xổ Số Miền Bắc chỉ dành cho mục đích giải trí. Đây là một trình giả lập **KHÔNG** có thật, mọi kết quả đều được tạo ngẫu nhiên trên trình duyệt của bạn.
Ứng dụng không sử dụng dữ liệu xổ số thật, không liên quan đến tiền bạc, cá cược hay ví điện tử. Mục tiêu chính là mang lại trải nghiệm vui vẻ, giúp bạn thử vận may và theo dõi các xu hướng một cách an toàn. Mọi dữ liệu (lịch sử, thống kê) đều được lưu trữ cục bộ trong `localStorage` của trình duyệt.
## ✨ Tính năng chính
-   **Tạo Kỳ Quay Ngẫu Nhiên**:
    -   Mỗi kỳ sẽ sinh ra một số 5 chữ số ngẫu nhiên (từ `00000` đến `99999`).
    -   Tính tổng 5 chữ số để xác định kết quả:
        -   **Tài / Xỉu**: Tổng ≥ 23 là **Tài**, ngược lại là **Xỉu**.
        -   **Chẵn / Lẻ**: Tổng là số chẵn là **Chẵn**, ngược lại là **Lẻ**.
-   **Chế Độ Quay Tự Động & Thủ Công**:
    -   **Auto (20 giây)**: Tự động tạo kỳ mới sau mỗi 20 giây, kèm đồng h�� đếm ngược và hiệu ứng âm thanh "tick".
    -   **Thủ công**: Nhấn nút "Đặt cược & Quay" để tạo kết quả ngay lập tức.
-   **Dự Đoán & Cược Ảo**:
    -   Chọn dự đoán **Tài/Xỉu** hoặc **Chẵn/Lẻ** trước mỗi kỳ.
    -   **Lướt ngang (swipe)** trên mobile để chuyển đổi gi��a hai chế độ dự đoán.
    -   Đặt cược bằng tiền ảo (bắt đầu với 1,000,000,000 VND).
    -   Nếu đoán đúng, bạn nhận lại **1.9 lần** số tiền cược (lợi nhuận 90%).
-   **Lịch Sử & Thống Kê Chi Tiết**:
    -   Lưu trữ 100 kỳ quay gần nhất trong `localStorage`.
    -   Bảng thống kê theo dõi: số dư, lợi nhuận, độ chính xác (%), chuỗi thắng dài nhất.
-   **Xu Hướng Soicau**: Biểu đồ grid động với cột dọc cho kết quả liên tiếp (Tài/Chẵn theo chiều dọc, cột mới khi đổi sang Xỉu/Lẻ).
-   **Thành Tích**: Mở khóa các huy hiệu như "Bậc Thầy Chuỗi" khi đạt chuỗi thắng 10.
-   **Xuất Dữ Liệu**: Tải toàn bộ lịch sử quay dưới d���ng file JSON từ menu Cài đặt.
-   **Hiệu Ứng**: Tích hợp âm thanh Web Audio và rung haptic (phản hồi xúc giác) trên thiết bị di động được hỗ trợ.
-   **Tùy Chỉnh Trải Nghiệm**:
    -   Bật/tắt âm thanh, điều chỉnh âm lượng.
    -   Chọn chủ đề giao diện (Tối, Sáng, Neon, Cổ điển).
    -   Tùy chỉnh giới hạn lịch sử lưu trữ.
-   **Giao Diện Hiện Đại & Thân Thiện**:
    -   Thiết kế dark-theme với hiệu ứng neon, gradient và glassmorphism.
    -   Tư��ng thích hoàn toàn với thiết bị di động (mobile-first).
    -   Thông báo kết quả bằng toast (thắng/thua) và hiệu ứng pháo hoa 🎊 khi thắng.
## 🛠️ Công nghệ sử dụng
-   **Frontend**: React 18+ với TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS v3 + shadcn/ui
-   **Quản lý Trạng thái**: Zustand
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Thông báo**: Sonner
-   **Routing**: React Router DOM
-   **Triển khai**: Cloudflare Pages (tĩnh)
-   **Tương thích**: Chrome 90+, Safari 14+, Firefox 88+, Mobile iOS/Android.
## 🚀 Cài đặt
Dự án sử dụng **Bun** làm trình quản lý gói để cài đặt nhanh hơn.
1.  **Clone repository**:
    ```bash
    git clone <repository-url>
    cd tai-xiu-mien-bac-gia-lap
    ```
2.  **Cài đặt dependencies**:
    ```bash
    bun install
    ```
## 🎮 Sử dụng
Chạy server development:
```bash
bun dev
```
Ứng dụng sẽ có tại `http://localhost:3000`.
-   **Chế độ Auto**: Nhấn "Bắt đầu Auto" để khởi động chu kỳ 20 giây.
-   **Quay ngay**: Nhấn "Đặt cược & Quay" để có kết quả tức thì.
-   **Dự đoán**: Chọn chế độ (Tài/Xỉu hoặc Chẵn/Lẻ), chọn kết quả và nhập số tiền cược.
-   **Xem lịch sử & thống kê**: Các bảng tương ứng sẽ tự động cập nhật.
-   **Dữ liệu**: Mọi thứ được lưu vào `localStorage`. Dữ liệu sẽ mất nếu bạn dùng chế độ ẩn danh hoặc xóa bộ nhớ trình duyệt.
### 🔧 Xử lý sự cố
-   **Font tiếng Việt bị lỗi**: Đảm bảo trình duyệt của bạn có thể tải font `Inter` và `Noto Sans` từ Google Fonts với `subset=vietnamese`.
-   **Trải nghiệm trên mobile**: Sử dụng thao tác **lướt ngang** trên khu vực chọn chế độ để chuyển đổi giữa Tài/Xỉu và Chẵn/Lẻ một cách nhanh chóng.
-   **Dữ liệu bị hỏng**: Nếu ứng dụng gặp lỗi lạ, hãy thử xóa dữ liệu trang web trong cài đặt trình duyệt (bao gồm `localStorage`).
## 🖼️ Screenshots
![Trang Chính](https://placehold.co/1200x600/171717/FFFFFF?text=Trang+Ch%C3%ADnh)
![Xu Hướng Soicau](https://placehold.co/600x400/9333ea/FFFFFF?text=Xu+H%C6%B0%E1%BB%9Bng+Soicau)
## 🏗️ Phát triển
-   **Linting**: Chạy `bun lint` để kiểm tra chất lượng code.
-   **Type Checking**: Chạy `bun tsc --noEmit` để kiểm tra lỗi TypeScript.
-   **Thêm tính năng**: Mở rộng các store trong `src/hooks/useGameStore.ts`. Logic game nằm trong `src/lib/simulator.ts`.
## ☁️ Triển khai
### Cloudflare Pages (Đề xuất cho v1)
1.  Cài đặt Wrangler CLI: `bun add -D wrangler`
2.  Đăng nhập: `wrangler login`
3.  Build dự án: `bun run build`
4.  Triển khai:
    ```bash
    wrangler pages publish dist --project-name=tai-xiu-mien-bac-gia-lap
    ```
## 🤝 Đóng góp
Mọi đóng góp đều được chào đón! Vui lòng fork repo, tạo một feature branch và gửi Pull Request với mô tả rõ ràng.
## 📄 Giấy phép
Dự án này được cấp phép theo giấy phép MIT. Chỉ sử dụng cho mục đích giải trí, không dành cho cờ bạc tiền thật.
---
*Built with ���️ at Cloudflare*