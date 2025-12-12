# 🌐 SuiHarvest Web Portal

Đây là giao diện Web (Front-end) cho dự án SuiHarvest, được xây dựng bằng **React + Vite**, **TailwindCSS** và **Sui dApp Kit**.

## 📚 Tài liệu Tham khảo (Quan trọng)
Trong quá trình dev, nếu bí code, hãy tra cứu tại đây:
- **Sui dApp Kit Docs:** [https://sdk.mystenlabs.com/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)
- **Sui TypeScript SDK:** [https://sdk.mystenlabs.com/typescript](https://sdk.mystenlabs.com/typescript)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🛠 Tech Stack
- **Core:** React (TypeScript) + Vite
- **Styling:** TailwindCSS
- **Blockchain:** `@mysten/dapp-kit` (Kết nối ví, transaction)
- **State Management:** `@tanstack/react-query`
- **Routing:** `react-router-dom`

---

## 🚀 Hướng dẫn Cài đặt & Chạy

### 1. Yêu cầu
- **Node.js:** v18 trở lên.
- **Ví:** Extension **Sui Wallet** (Đã chuyển sang mạng **Testnet**).

### 2. Chạy dự án
Mở Terminal tại thư mục `web-portal/`:

```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy server phát triển
npm run dev