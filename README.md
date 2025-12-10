# 🎲 Tài Xỉu Miền Bắc - Giả Lập
## Tổng quan
**Tài Xỉu Miền Bắc Giả Lập** là một ứng dụng web client-side mô phỏng "Giải Đặc Biệt" của Xổ Số Miền Bắc chỉ dành cho mục đích giải trí. Đây là một trình giả lập **KHÔNG** có thật, mọi kết quả đều được tạo ngẫu nhiên trên trình duyệt của bạn.
Ứng dụng không sử dụng dữ liệu xổ số thật, không liên quan đến tiền bạc, cá cược hay ví điện tử. Mục tiêu chính là mang lại trải nghiệm vui vẻ, giúp bạn thử vận may và theo dõi các xu hướng một cách an toàn. Mọi dữ liệu (lịch sử, thống kê) đều được lưu trữ cục bộ trong `localStorage` của trình duyệt.
## ✨ Tính Năng Hoàn Chỉnh
-   **Chế độ quay tự động 20 giây**: Với đồng hồ đếm ngược neon và hiệu ứng âm thanh "tick" cho mỗi giây.
-   **Dự đoán độc quyền**: Chọn Tài/Xỉu hoặc Chẵn/Lẻ với thao tác lướt ngang (swipe) trên mobile.
-   **Cược ảo 1.9x**: Đặt cược bằng tiền ảo và nhận lại 1.9 lần số tiền nếu thắng (lợi nhuận 90%).
-   **Xu hướng soicau**: Biểu đồ grid động hiển thị kết quả theo cột, với tooltip chi tiết khi hover.
-   **Thành tích tự động**: Mở khóa các huy hiệu khi đạt các cột mốc (chuỗi thắng 5/10, 50/100 kỳ, 50 thắng).
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
-   **Hướng dẫn chi tiết**: Modal hướng dẫn chơi tích hợp sẵn trong ứng dụng.
## ��️ Hình Ảnh Minh Họa
![Trang Chính - Timer và Dự Đoán](https://placehold.co/1200x600/171717/FFFFFF?text=Trang+Ch%C3%ADnh+-+Timer+v%C3%A0+D%E1%BB%B1+%C4%90o%C3%A1n)
![Xu Hướng Soicau](https://placehold.co/600x400/9333ea/FFFFFF?text=Xu+H%C6%B0%E1%BB%9Bng+Soicau)
![Thống Kê & Thành Tích](https://placehold.co/600x400/f38020/FFFFFF?text=Th%E1%BB%91ng+K%C3%AA+%26+Th%C3%A0nh+T%C3%ADch)
## 🛠️ Công nghệ sử dụng
-   **Frontend**: React 18+ với TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS v3 + shadcn/ui
-   **Quản lý Trạng thái**: Zustand
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Thông báo**: Sonner
-   **Triển khai**: Cloudflare Pages (tĩnh)
## 📱 Tương Thích & Kiểm Tra
Dự án đã được kiểm tra và hoạt động tốt trên các trình duyệt hiện đại:
-   **Desktop**: Chrome, Firefox, Safari, Edge (phiên bản mới nhất).
-   **Mobile**: Mobile Safari (iOS 15+), Chrome for Android.
-   **Lưu ý**:
    -   Trải nghiệm trên di động được tối ưu hóa với các thao tác cảm ứng như **lướt ngang** để đổi chế độ cược và **phản hồi xúc giác (haptic feedback)** khi tương tác.
    -   Font tiếng Việt với đầy đủ dấu được hiển thị chính xác trên tất cả các nền tảng được hỗ trợ.
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
## 🚀 Sử dụng
Chạy server development:
```bash
bun dev
```
Ứng dụng sẽ có tại `http://localhost:3000`.
-   **Chế độ Auto**: Nhấn "Bắt đầu Auto" để khởi động chu kỳ 20 giây.
-   **Quay ngay**: Nhấn "Đặt cược & Quay" để có kết quả tức thì.
-   **Dữ liệu**: Mọi thứ được lưu vào `localStorage`. Dữ liệu sẽ mất nếu bạn d��ng chế độ ẩn danh hoặc xóa bộ nhớ trình duyệt.
## 🔧 Xử Lý Sự Cố
-   **Font tiếng Việt bị lỗi**: Đảm bảo trình duyệt của bạn không chặn các yêu cầu đến `fonts.googleapis.com` và `fonts.gstatic.com`. Thử xóa cache trình duyệt và tải lại trang.
-   **Dữ liệu bị hỏng hoặc ứng dụng không hoạt động đúng**:
    1. Mở Developer Tools (F12 hoặc Ctrl+Shift+I).
    2. Đi đến tab "Application" (hoặc "Storage").
    3. Tìm "Local Storage", chọn trang web này và nhấn "Clear all".
    4. Tải lại trang (Ctrl+R). Thao tác này sẽ đặt lại toàn bộ dữ liệu của bạn.
-   **Âm thanh không tự động phát**: Hầu hết các trình duyệt hiện đại yêu cầu người dùng tương tác với trang (nhấp chuột, chạm) trước khi âm thanh có thể được phát. Hãy nhấp vào bất kỳ đ��u trên trang để kích hoạt âm thanh.
## ☁️ Triển Khai
Dự án đã sẵn sàng để triển khai trên Cloudflare Pages.
1.  **Build dự án**:
    ```bash
    bun run build
    ```
    Lệnh này sẽ tạo một thư mục `dist` chứa các file tĩnh đã được tối ưu hóa.
2.  **Triển khai lên Cloudflare Pages**:
    Cài đặt Wrangler CLI nếu chưa có: `bun add -D wrangler`. Sau đó đăng nhập với `wrangler login`.
    Chạy lệnh sau để xuất bản:
    ```bash
    wrangler pages publish dist --project-name=tai-xiu-mien-bac-gia-lap
    ```
    Thay `tai-xiu-mien-bac-gia-lap` bằng tên dự án của bạn trên Cloudflare nếu cần.
## 🤝 Đóng Góp
Mọi đóng góp nhằm cải thiện dự án đều được chào đón! Vui lòng fork repository, tạo một feature branch mới cho tính năng của bạn, và gửi một Pull Request với mô tả chi tiết về những thay đổi.
## 📄 Giấy Phép
Dự án này được cấp phép theo giấy phép MIT. Mã nguồn được cung cấp "nguyên trạng" và chỉ dành cho mục đích học tập và giải trí. Tác giả không chịu trách nhiệm cho bất kỳ việc sử dụng sai mục đích nào. **Không dành cho cờ bạc tiền thật.**
---
*© 2025 CLTX MB • Dev by MinL x Cloudflare*
