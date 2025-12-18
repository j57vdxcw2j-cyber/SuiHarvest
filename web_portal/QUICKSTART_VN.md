# 🚀 Quick Start Guide - SuiHarvest Backend

Chào bạn! Đây là hướng dẫn nhanh để bắt đầu sử dụng Firebase backend.

## ✅ Đã hoàn thành

Phase 2 đã được triển khai xong với:
- ✅ Firebase SDK đã cài đặt
- ✅ Hệ thống types hoàn chỉnh
- ✅ Service layer (authService, userService, walletService)
- ✅ AuthContext cho state management
- ✅ Profile component tích hợp Firebase
- ✅ Build thành công không lỗi

## 📝 Bước tiếp theo

### Bước 1: Tạo Firebase Project

1. Truy cập: https://console.firebase.google.com/
2. Click "Add project" (Thêm dự án)
3. Nhập tên: `suiharvest` (hoặc tên bạn muốn)
4. Tắt Google Analytics (không bắt buộc cho dev)
5. Click "Create project"

### Bước 2: Thêm Web App

1. Trong Firebase Console, click icon **Web** `</>`
2. Đăng ký tên app: `SuiHarvest Web Portal`
3. **Không** check "Firebase Hosting"
4. Click "Register app"

### Bước 3: Lấy Configuration

Bạn sẽ thấy config như này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "suiharvest-xxxxx.firebaseapp.com",
  projectId: "suiharvest-xxxxx",
  storageBucket: "suiharvest-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Bước 4: Tạo file .env

1. Copy file `.env.example` thành `.env`:
   ```bash
   cd web_portal
   copy .env.example .env
   ```

2. Mở file `.env` và điền config của bạn:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=suiharvest-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=suiharvest-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=suiharvest-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

⚠️ **Quan trọng**: Không commit file `.env` lên Git!

### Bước 5: Enable Authentication

1. Trong Firebase Console, vào **Build > Authentication**
2. Click "Get started"
3. Vào tab **Sign-in method**
4. Enable **Anonymous** authentication

### Bước 6: Tạo Firestore Database

1. Trong Firebase Console, vào **Build > Firestore Database**
2. Click "Create database"
3. Chọn location gần bạn nhất (vd: `asia-southeast1`)
4. Chọn **Test mode** (cho development)

### Bước 7: Thêm Test Data

Thêm một user test để thử nghiệm:

1. Vào **Firestore Database**
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: `0x1234567890abcdef` (địa chỉ ví test)
5. Thêm fields theo mẫu trong `FIREBASE_SETUP.md`

### Bước 8: Chạy Development Server

```bash
cd web_portal
npm run dev
```

Mở browser và kiểm tra:
- ✅ Console không có lỗi Firebase
- ✅ Message "Firebase initialized successfully"

## 🎮 Test Profile Page

1. Mở http://localhost:5173/#profile
2. Bạn sẽ thấy "Please connect your wallet"
3. Để test với data thật:
   - Tạm thời hardcode wallet address trong AuthContext
   - Hoặc đợi tích hợp Sui Wallet

## 📚 Tài liệu chi tiết

- **FIREBASE_SETUP.md** - Hướng dẫn setup đầy đủ
- **PHASE2_SUMMARY.md** - Tóm tắt implementation
- **README.md** - Tài liệu tổng quan

## 🔌 Tích hợp Sui Wallet (Bước tiếp theo)

Khi sẵn sàng tích hợp ví thật:

```bash
npm install @mysten/dapp-kit @mysten/sui.js @tanstack/react-query
```

Sau đó cập nhật Navigation.tsx và AuthContext.tsx để dùng Sui Wallet SDK.

## ⚡ Các file quan trọng

- `src/config/firebase.ts` - Firebase config
- `src/services/userService.ts` - CRUD user data
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/components/Profile.tsx` - Profile page

## 🐛 Troubleshooting

**Lỗi: Firebase config missing**
→ Kiểm tra file `.env` đã tồn tại và đúng format

**Lỗi: Permission denied**
→ Kiểm tra Firestore ở test mode

**Profile không load**
→ Kiểm tra đã thêm test user vào Firestore

## 💡 Gợi ý

1. Bắt đầu với FIREBASE_SETUP.md để hiểu rõ hơn
2. Test với mock data trước khi tích hợp wallet
3. Dùng Firebase Console để xem data real-time

---

**Status:** ✅ Phase 2 Complete  
**Tiếp theo:** Firebase configuration → Test with data → Wallet integration

Chúc bạn thành công! 🎉
