# MD Base64 Image Cleaner 🧹

Ứng dụng Next.js để loại bỏ ảnh base64 khỏi file Markdown và phân tích các yếu tố làm nặng file.

## ✨ Tính năng

- ✅ **Loại bỏ ảnh base64** - Xóa tất cả ảnh base64 embedded trong file .md
- 📊 **Phân tích chi tiết** - Hiển thị các yếu tố làm nặng file:
  - Ảnh Base64
  - Link ảnh dài
  - HTML Tags
  - Khoảng trắng thừa
  - Reference-style images
- 💾 **Tiết kiệm dung lượng** - Giảm kích thước file đáng kể (ví dụ: 11MB → vài KB)
- 🎨 **Giao diện đẹp** - UI hiện đại với Tailwind CSS
- ⚡ **Xử lý nhanh** - Upload và nhận kết quả ngay lập tức

## 🚀 Cài đặt

```bash
# Clone hoặc tạo project
cd /Users/vupeter/Local Sites/base64imgremove

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để sử dụng.

## 📖 Cách sử dụng

1. **Upload file**: Click vào vùng upload hoặc kéo thả file .md
2. **Phân tích**: Click "Phân tích và Làm sạch"
3. **Xem kết quả**:
   - Kích thước ban đầu vs sau khi làm sạch
   - % tiết kiệm được
   - Chi tiết các yếu tố làm nặng file
4. **Tải xuống**: Click "Tải xuống file đã làm sạch"

## 🔍 Phân tích file eg.md

File ví dụ `eg.md` của bạn:
- **Kích thước**: 11MB
- **Số dòng**: 745
- **Ảnh base64**: 18 ảnh (chiếm ~99% dung lượng)

Sau khi xử lý:
- Giảm từ 11MB xuống còn vài KB
- Loại bỏ hoàn toàn ảnh base64
- Giữ nguyên nội dung text
- Thay thế ảnh bằng comment HTML

## 🛠️ Công nghệ

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Server Actions** - API routes

## 📁 Cấu trúc project

```
base64imgremove/
├── app/
│   ├── api/
│   │   └── clean/
│   │       └── route.ts       # API xử lý file
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Trang chính
├── public/                    # Static files
├── eg.md                      # File ví dụ
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎯 Các yếu tố được phân tích

1. **Ảnh Base64** ⚠️ - Yếu tố chính làm nặng file
   - Inline: `![alt](data:image/...)`
   - Reference: `[image1]: <data:image/...>`

2. **Link ảnh dài** - URLs dài trong markdown

3. **HTML Tags** - Các thẻ HTML embedded

4. **Khoảng trắng thừa** - 3+ dòng trống liên tiếp

5. **Reference images** - Style định nghĩa ảnh riêng

## 🔧 Tùy chỉnh

Bạn có thể chỉnh sửa logic xử lý trong [app/api/clean/route.ts](app/api/clean/route.ts):

- `analyzeMarkdown()` - Thêm/bớt các pattern phân tích
- `removeBase64Images()` - Tùy chỉnh cách loại bỏ ảnh

## 📝 License

MIT

## 👨‍💻 Author

Được tạo với Claude Code
