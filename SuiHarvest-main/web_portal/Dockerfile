# Giai đoạn 1: Build code (Dùng Node 20 cho xịn)
FROM node:20-alpine as builder

WORKDIR /app

# Copy file package trước để cài thư viện (tận dụng cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ code vào và build
COPY . .
RUN npm run build

# Giai đoạn 2: Chạy web bằng Nginx (Nhẹ và nhanh)
FROM nginx:alpine

# Copy code đã build xong vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx (để sửa lỗi F5 trang)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]