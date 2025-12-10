# 🎲 Tài Xỉu Miền Bắc - Giả Lập
## Tổng quan
**Tài Xỉu Miền Bắc Giả Lập** là một ứng dụng web client-side mô phỏng "Giải Đặc Biệt" của Xổ Số Miền Bắc chỉ dành cho mục đích giải trí. Đây là một trình giả lập **KHÔNG** có thật, mọi kết quả đều được tạo ngẫu nhiên trên trình duyệt của bạn.
Ứng dụng không sử dụng dữ liệu xổ số thật, không liên quan đến tiền bạc, cá cược hay ví điện tử. Mục tiêu chính là mang lại trải nghiệm vui vẻ, giúp bạn thử vận may và theo dõi các xu hướng một cách an toàn. Mọi dữ liệu (lịch sử, thống kê) đều được lưu trữ cục bộ trong `localStorage` của trình duyệt.
## ✨ Tính Năng Hoàn Chỉnh
-   **Chế độ quay tự động 20 giây**: Với đồng hồ đếm ngược neon và hiệu ứng âm thanh "tick" cho mỗi giây.
-   **Dự đoán độc quyền**: Chọn Tài/Xỉu hoặc Chẵn/Lẻ với thao tác lướt ngang (swipe) trên mobile.
-   **Cược ảo 1.9x**: Đặt cược b��ng tiền ảo và nhận lại 1.9 lần số tiền nếu thắng (lợi nhuận 90%).
-   **Xu hướng soicau**: Biểu đồ grid động hiển thị kết quả theo cột, với tooltip chi tiết khi hover.
-   **Thành tích tự động**: Mở khóa các huy hiệu khi đạt các cột mốc (chuỗi thắng, số kỳ đã chơi).
-   **Lịch sử & Thống kê**: Lưu trữ 100 kỳ gần nhất, theo dõi số dư, lợi nhuận, độ chính xác và chuỗi thắng.
-   **Hiệu ứng đa dạng**: Âm thanh Web Audio, rung haptic (phản hồi xúc giác), và hiệu ứng pháo hoa 🎊 khi thắng.
-   **Tùy chỉnh trải nghiệm**:
    -   Bật/tắt âm thanh, điều chỉnh âm lượng.
    -   Chọn chủ đề giao diện (Tối, Sáng, Neon, Cổ điển).
    -   Tùy chỉnh giới hạn lịch sử lưu trữ.
-   **Xuất dữ liệu**: Tải toàn bộ lịch sử quay dưới dạng file JSON từ menu Cài đặt.
-   **Giao Diện Hiện Đại & Thân Thiện**:
    -   Thiết kế dark-theme với hiệu ứng neon, gradient và glassmorphism.
    -   Tương thích hoàn toàn với thiết bị di động (mobile-first).
## 🛠️ Công nghệ sử dụng
-   **Frontend**: React 18+ với TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS v3 + shadcn/ui
-   **Quản lý Trạng thái**: Zustand
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Thông báo**: Sonner
-   **Triển khai**: Cloudflare Pages (tĩnh)
## ✅ Kiểm tra Tương thích
Dự án đã được kiểm tra và hoạt động tốt trên các trình duyệt hiện đại:
-   **Desktop**: Chrome, Firefox, Safari, Edge.
-   **Mobile**: Mobile Safari (iOS), Chrome for Android.
-   Font tiếng Việt với đầy đủ dấu được hiển thị chính xác trên tất cả các nền tảng.
## 📦 Cài đặt
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
## 🎮 S�� dụng
Chạy server development:
```bash
bun dev
```
Ứng dụng sẽ có tại `http://localhost:3000`.
-   **Chế độ Auto**: Nhấn "Bắt đầu Auto" để khởi động chu kỳ 20 giây.
-   **Quay ngay**: Nhấn "Đặt cược & Quay" để có kết quả tức thì.
-   **Dự đoán**: Chọn chế độ (Tài/Xỉu hoặc Chẵn/Lẻ), chọn kết quả và nhập số tiền cược.
-   **Xem lịch sử & thống kê**: Các bảng tương ứng sẽ tự động cập nhật.
-   **Dữ liệu**: Mọi thứ được lưu vào `localStorage`. Dữ liệu sẽ mất nếu bạn dùng chế độ ẩn danh hoặc xóa bộ nh�� trình duyệt.
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
## ☁️ Triển khai Sản xuất
Dự án đã sẵn sàng để triển khai trên Cloudflare Pages.
1.  **Build dự án**:
    ```bash
    bun run build
    ```
    Lệnh này sẽ tạo một thư mục `dist` chứa các file tĩnh đã được tối ưu hóa.
2.  **Triển khai lên Cloudflare Pages**:
    Cài đặt Wrangler CLI nếu chưa có: `bun add -D wrangler`. Sau đó đăng nhập với `wrangler login`.
    ```bash
    wrangler pages publish dist --project-name=tai-xiu-mien-bac-gia-lap
    ```
    Thay `tai-xiu-mien-bac-gia-lap` bằng tên dự án của bạn trên Cloudflare nếu cần.
## 🤝 Đóng góp
Mọi đóng góp đều được chào đón! Vui lòng fork repo, tạo một feature branch và gửi Pull Request với mô tả rõ ràng.
## 📄 Giấy phép
Dự án này được cấp phép theo giấy phép MIT. Chỉ sử dụng cho mục đích giải trí, không dành cho cờ bạc tiền thật.
---
*Dự án Hoàn Thành - Sẵn Sàng Triển Khai. Built with ❤️ at Cloudflare.*