# 🔥 Hướng dẫn tạo Firebase Account từ đầu

## Bước 1: Tạo Google Account (nếu chưa có)

Nếu bạn đã có Gmail, skip bước này.

1. Truy cập: https://accounts.google.com/signup
2. Điền thông tin cá nhân
3. Xác thực email/phone
4. Hoàn tất tạo account

## Bước 2: Truy cập Firebase Console

1. Mở trình duyệt và truy cập: **https://console.firebase.google.com/**
2. Đăng nhập bằng Google account của bạn
3. Bạn sẽ thấy màn hình "Welcome to Firebase"

## Bước 3: Tạo Firebase Project

1. Click nút **"Create a project"** (hoặc "Add project")
2. Nhập tên project: `suiharvest`
3. Click **"Continue"**
4. **Tắt** Google Analytics (không cần thiết cho development)
   - Hoặc để mặc định nếu muốn dùng
5. Click **"Create project"**
6. Đợi 10-30 giây để Firebase tạo project
7. Click **"Continue"** khi thấy "Your new project is ready"

## Bước 4: Thêm Web App vào Project

1. Trên màn hình chính, bạn sẽ thấy:
   - iOS icon
   - Android icon
   - **Web icon `</>`** ← Click vào đây
2. **Nhập nickname cho app**: `SuiHarvest Web Portal`
3. **KHÔNG** check ô "Also set up Firebase Hosting"
4. Click **"Register app"**

## Bước 5: Copy Firebase Configuration

Sau khi đăng ký app, bạn sẽ thấy code như này:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "suiharvest-xxxxx.firebaseapp.com",
  projectId: "suiharvest-xxxxx",
  storageBucket: "suiharvest-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

**📋 COPY tất cả các values này!**

## Bước 6: Điền vào file .env

1. Mở file `web_portal\.env` trong VS Code
2. Thay thế các giá trị:

```env
# Thay "AIzaSy..." bằng apiKey của bạn
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Thay "suiharvest-xxxxx" bằng authDomain của bạn
VITE_FIREBASE_AUTH_DOMAIN=suiharvest-xxxxx.firebaseapp.com

# Thay project ID
VITE_FIREBASE_PROJECT_ID=suiharvest-xxxxx

# Thay storage bucket
VITE_FIREBASE_STORAGE_BUCKET=suiharvest-xxxxx.appspot.com

# Thay sender ID
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012

# Thay app ID
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Thay measurement ID (nếu có)
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Save file** (Ctrl + S)

## Bước 7: Enable Authentication

1. Quay lại Firebase Console
2. Trong sidebar bên trái, click **"Build"** → **"Authentication"**
3. Click nút **"Get started"**
4. Bạn sẽ thấy tab **"Sign-in method"**
5. Tìm **"Anonymous"** trong danh sách
6. Click vào **"Anonymous"**
7. Toggle switch sang **"Enable"**
8. Click **"Save"**

## Bước 8: Tạo Firestore Database

1. Trong sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Chọn location (khuyến nghị):
   - **asia-southeast1** (Singapore) - gần Việt Nam nhất
   - Hoặc **asia-east1** (Taiwan)
4. Chọn **"Start in test mode"**
   - ⚠️ Lưu ý: Test mode cho phép read/write tự do (chỉ dùng khi dev)
   - Production sẽ cần security rules
5. Click **"Enable"**

## Bước 9: Tạo Collections (Tùy chọn)

Bạn có thể tạo collections ngay bây giờ hoặc để code tự tạo.

### Tạo collection "users":

1. Click **"Start collection"**
2. **Collection ID**: `users`
3. Click **"Next"**
4. Tạo document đầu tiên (test):
   - **Document ID**: `test_user`
   - Click **"Add field"** và thêm:
     ```
     Field: walletAddress
     Type: string
     Value: 0x1234567890abcdef
     
     Field: username
     Type: string
     Value: TestUser
     
     Field: level
     Type: number
     Value: 1
     
     Field: experience
     Type: number
     Value: 0
     ```
5. Click **"Save"**

## Bước 10: Restart Dev Server

1. Trong terminal, dừng server hiện tại (Ctrl + C)
2. Chạy lại:
   ```bash
   npm run dev
   ```

3. Mở browser tại http://localhost:5173

4. Mở Console (F12) và kiểm tra:
   - ✅ Bạn sẽ thấy: **"✅ Firebase initialized successfully"**
   - ❌ Nếu thấy lỗi, kiểm tra lại file `.env`

## Bước 11: Test Profile Page

1. Truy cập: http://localhost:5173/#profile
2. Bạn sẽ không còn thấy "Firebase Setup Required"
3. Thay vì đó, sẽ thấy "Please connect your wallet"

✅ **Hoàn thành!** Firebase đã được setup thành công!

---

## 📸 Screenshots Tham khảo

### Firebase Console - Home
![Firebase Home](https://firebase.google.com/images/social.png)

### Tạo Project
- Nhập tên: `suiharvest`
- Tắt Analytics
- Click Create

### Web App Setup
- Click icon `</>`
- Nhập nickname
- Copy config

### Authentication Setup
- Build → Authentication
- Get started
- Enable Anonymous

### Firestore Setup
- Build → Firestore Database
- Create database
- asia-southeast1
- Test mode

---

## 🔍 Kiểm tra Setup

### File .env phải có dạng:
```env
VITE_FIREBASE_API_KEY=AIza...           ← Bắt đầu bằng "AIza"
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=suiharvest-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=12345...
VITE_FIREBASE_APP_ID=1:12345...
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXX
```

### Firebase Console phải có:
- ✅ Project: suiharvest
- ✅ Authentication: Anonymous enabled
- ✅ Firestore Database: Created in test mode
- ✅ Web App: Registered

### Browser Console phải hiển thị:
```
✅ Firebase initialized successfully
ℹ️ Firebase not configured - running in demo mode  ← Sẽ biến mất sau khi config
```

---

## ❓ Troubleshooting

### Lỗi: "invalid-api-key"
→ Kiểm tra `VITE_FIREBASE_API_KEY` trong `.env`
→ Phải bắt đầu bằng "AIza"
→ Không có khoảng trắng thừa

### Lỗi: "project-not-found"
→ Kiểm tra `VITE_FIREBASE_PROJECT_ID`
→ Phải trùng với project ID trong Firebase Console

### Firebase Console không load
→ Thử trình duyệt khác (Chrome/Edge recommended)
→ Kiểm tra internet connection
→ Clear cache và reload

### File .env không work
→ Restart dev server (npm run dev)
→ Đảm bảo file tên là `.env` chứ không phải `.env.txt`
→ File phải ở trong folder `web_portal/`

### Authentication không enable được
→ Đảm bảo đã click "Get started" trong Authentication
→ Click vào "Anonymous" rồi toggle "Enable"
→ Nhớ click "Save"

---

## 💡 Tips

1. **Miễn phí**: Firebase free tier rất hào phóng
   - 10GB storage
   - 50K reads/day
   - 20K writes/day
   - Đủ cho development và small apps

2. **Test mode security rules**: 
   - Rules tự động expire sau 30 ngày
   - Production cần rules proper

3. **Backup config**:
   - Copy config values vào file riêng
   - Không commit `.env` lên Git

4. **Multiple environments**:
   - Dev: `.env`
   - Production: `.env.production`

---

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

**Tổng thời gian setup:** ~10-15 phút  
**Chi phí:** Miễn phí (Spark plan)  
**Khó khăn:** ⭐⭐☆☆☆ (Dễ)

Chúc bạn setup thành công! 🎉
