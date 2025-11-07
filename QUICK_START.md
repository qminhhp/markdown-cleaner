# 🚀 Hướng dẫn sử dụng nhanh

## Khởi động ứng dụng

Ứng dụng đã sẵn sàng tại: **http://localhost:3000**

Nếu chưa chạy:
```bash
npm run dev
```

## Sử dụng

### Bước 1: Truy cập
Mở trình duyệt và vào: http://localhost:3000

### Bước 2: Upload file
- Click vào vùng "Chọn file .md hoặc .markdown"
- Hoặc kéo thả file eg.md vào

### Bước 3: Phân tích
- Click nút "Phân tích và Làm sạch"
- Đợi vài giây

### Bước 4: Xem kết quả
Bạn sẽ thấy:
- ✅ Kích thước ban đầu: 11MB
- ✅ Kích thước sau: ~10-20KB
- ✅ Tiết kiệm: ~99%
- ✅ Chi tiết phân tích:
  - 18 ảnh base64
  - Link ảnh
  - HTML tags
  - Khoảng trắng thừa

### Bước 5: Tải xuống
Click "Tải xuống file đã làm sạch" để lấy file cleaned_eg.md

## 📊 Kết quả mẫu với file eg.md

**Trước khi làm sạch:**
- Kích thước: 11MB
- 745 dòng
- 18 ảnh base64 nhúng trực tiếp

**Sau khi làm sạch:**
- Kích thước: ~10-20KB
- Nội dung text giữ nguyên
- Ảnh base64 được thay bằng comment
- Giảm 99% dung lượng

## 🔍 Các yếu tố được phát hiện

1. **Ảnh Base64** (chiếm 99% dung lượng)
   - Inline images: `![alt](data:image/png;base64,...)`
   - Reference images: `[image1]: <data:image/...>`

2. **Link ảnh dài**
   - URLs dài trong markdown

3. **HTML Tags**
   - Thẻ HTML nhúng trong markdown

4. **Khoảng trắng thừa**
   - Nhiều dòng trống liên tiếp

## ⚡ Tips

- File markdown nên sử dụng link ảnh thay vì base64
- Base64 làm file rất nặng và khó quản lý
- Nên host ảnh trên CDN hoặc dịch vụ như Imgur, GitHub

## 🛠️ Tùy chỉnh

Để thêm/bớt pattern phân tích, sửa file:
- `app/api/clean/route.ts`

Để thay đổi giao diện:
- `app/page.tsx`
- `app/globals.css`

## 📝 Ví dụ file đã làm sạch

```markdown
To get rid of mushrooms in your yard...

<!-- Ảnh base64 đã được loại bỏ: Hình thu nhỏ của video có liên quan -->

Immediate removal
...
```

## 🎯 Lợi ích

- ⚡ Giảm 99% dung lượng
- 🚀 File load nhanh hơn
- 📱 Dễ chia sẻ qua email/chat
- 💾 Tiết kiệm bộ nhớ
- 🔍 Dễ đọc và chỉnh sửa

---

**Thưởng thức! 🎉**
