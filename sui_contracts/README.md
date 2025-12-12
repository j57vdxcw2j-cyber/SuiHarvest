# 📦 Sui Contracts - Setup & Deploy Guide

Đây là thư mục chứa Smart Contract (Move) cho dự án SuiHarvest.

## 1. Yêu cầu môi trường (Prerequisites)
- **Sui CLI:** Phiên bản mới nhất (v1.x).
- **VS Code Extension:** Cài đặt extension "Sui Move Analyzer" để highlight code.

## 2. Thiết lập Mạng (Quan trọng)
Chúng ta sẽ **KHÔNG** dùng Localnet để tránh lỗi kết nối với team khác. Hãy dùng **Testnet**.

Chạy lần lượt các lệnh sau trong Terminal:

```bash
# 1. Tạo ví mới (nếu chưa có)
sui client new-address ed25519

# 2. Chuyển môi trường sang Testnet
sui client switch --env testnet

# 3. Xin tiền (Faucet) để có gas deploy
sui client faucet

```

## 3. Các lệnh thường dùng
3.1. Build **(Biên dịch code)**

```bash
sui move build

```

3.2. Test **(Chạy Unit Test)**

```bash
sui move test

```

3.3. Deploy **(Triển khai contract lên mạng)**

```bash
sui client publish --gas-budget 100000000 --skip-dependency-verification

# Lưu ý: Ghi nhớ địa chỉ package sau khi deploy thành công
```

**Có thể sử dụng [Harriw](https://harriweb3.dev/app) để thực hiện những bước trên**