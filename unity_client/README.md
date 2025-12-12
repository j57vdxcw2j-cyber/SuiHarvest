# 🎮 Unity Client - Setup Guide

Đây là project Unity chính của game.

## 1. Yêu cầu bắt buộc (Strict Versioning)
Để tránh conflict (xung đột) file hệ thống, tất cả thành viên team Game phải cài ĐÚNG phiên bản sau:

- **Unity Version:** `2022.3.x LTS` (Khuyên dùng bản mới nhất của dòng 2022.3 LTS).
- **IDE:** VS Code (đã cài C# Dev Kit).

## 2. Cách mở dự án (Đúng cách)
1. Mở **Unity Hub**.
2. Tab **Projects** -> Chọn **Open**.
3. Trỏ vào thư mục `SuiHarvest-Monorepo/unity-client` (Không trỏ vào thư mục cha, không trỏ sâu vào Assets).

## 3. Cấu hình lần đầu (First Time Setup)
Khi mở project lần đầu, hãy làm ngay các bước sau:

1. **Switch Platform:** Vào *File > Build Settings* -> Chọn **Windows/Mac/Linux** (để dev cho nhanh) hoặc **WebGL** (nếu muốn build web).
2. **Setup VS Code:**
   - Vào *Edit > Preferences > External Tools*.
   - Mục *External Script Editor*: Chọn **Visual Studio Code**.
   - Bấm **Regenerate project files**.
3. **Import Assets:**
   - Các file ảnh `.png` từ Artist phải được copy vào `Assets/Sprites/`.
   - **QUAN TRỌNG:** Click vào ảnh -> Inspector -> Chỉnh **Filter Mode** thành `Point (no filter)` và **Compression** thành `None` để ảnh Pixel không bị mờ.

## 4. Kết nối Blockchain
- SDK Sui cho Unity nằm trong `Assets/SuiSDK` (hoặc cài qua Package Manager).
- Khi Team Blockchain gửi **Package ID**, hãy update nó vào file `GameManager.cs` hoặc `Config.cs`.

## 5. Lưu ý Git
- **KHÔNG BAO GIỜ** commit thư mục `Library/`, `Temp/`, `Logs/`.
- Luôn `git pull` trước khi bắt đầu làm việc.