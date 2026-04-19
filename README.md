# Orion - Trình quản lý mật khẩu thế hệ mới (Next-Gen Password Manager)

[![Sui](https://img.shields.io/badge/Built%20on-Sui-blue)](https://sui.io)
[![Walrus](https://img.shields.io/badge/Storage-Walrus-orange)](https://walrus.xyz)
[![zkLogin](https://img.shields.io/badge/Auth-zkLogin-green)](https://sui.io/zklogin)

**Orion** là một hệ sinh thái quản lý mật khẩu phi tập trung, bảo mật tuyệt đối (Zero-Knowledge) được xây dựng trên **Sui Blockchain**. Dự án kết hợp trải nghiệm người dùng mượt mà của Web2 (đăng nhập bằng Google) với sức mạnh bảo mật của Web3 (mã hóa đầu cuối, lưu trữ phi tập trung).

> **"Trải nghiệm Web2, Bảo mật Web3"** — Orion loại bỏ hoàn toàn nhu cầu về Seed Phrase hay Private Key phức tạp, mang lại giải pháp quản lý mật khẩu an toàn và dễ tiếp cận cho tất cả mọi người.

---

## 🚀 Các Thành Phần Dự Án (Monorepo)

Toàn bộ hệ sinh thái Orion hiện được hợp nhất vào một repository duy nhất để dễ dàng quản lý và phát triển:

- **[`orion-extension`](./orion-extension)**: Tiện ích trình duyệt (Chrome Extension) - trái tim của dự án, nơi người dùng quản lý mật khẩu và tự động điền (Autofill).
- **[`orion-landing`](./orion-landing)**: Trang giới thiệu sản phẩm với giao diện hiện đại, cao cấp.
- **[`orion-docs`](./orion-docs)**: Cổng thông tin tài liệu kỹ thuật dành cho nhà phát triển, giải thích chi tiết về kiến trúc và mô hình bảo mật.
- **[`orion-contract`](./orion-contract)**: Các Smart Contract (Sui Move) quản lý các liên kết vault (Vault Pointers) trên blockchain.
- **[`orion-gas-station`](./orion-gas-station)**: Dịch vụ hỗ trợ phí gas (Sponsored Transactions), giúp người dùng không cần sở hữu token SUI vẫn có thể sử dụng ứng dụng.

---

## ✨ Tính Năng Nổi Bật

### 🔐 Bảo Mật Zero-Knowledge
Mật khẩu của bạn được mã hóa bằng thuật toán **AES-256-GCM** ngay trên trình duyệt trước khi được gửi đi. Chỉ duy nhất bạn mới có chìa khóa để giải mã dữ liệu của mình.

### 🌐 Đăng Nhập Tiện Lợi với zkLogin
Không cần tạo ví, không cần lưu trữ 24 ký tự phục hồi. Bạn có thể đăng nhập ngay lập tức bằng tài khoản **Google** thông qua công nghệ **zkLogin** của Sui, vẫn đảm bảo tính phi tập trung và bảo mật cao.

### 📦 Lưu Trữ Phi Tập Trung trên Walrus
Dữ liệu đã mã hóa của bạn được lưu trữ trên giao thức **Walrus**, đảm bảo tính bất biến và khả năng truy cập vĩnh viễn mà không phụ thuộc vào bất kỳ máy chủ trung tâm nào.

### 🛡️ Hệ Thống Phục Hồi Khẩn Cấp (Emergency Kit)
Ngay cả khi mất quyền truy cập vào phương thức đăng nhập chính, bạn vẫn có thể khôi phục dữ liệu thông qua mã phục hồi được tạo riêng biệt, đảm bảo bạn không bao giờ bị mất dữ liệu.

---

## 🛠️ Công Nghệ Sử Dụng

- **Blockchain**: Sui Network
- **Storage**: Walrus Protocol
- **KDF (Key Derivation)**: Argon2id (15 iterations, 64MB)
- **Encryption**: AES-256-GCM (Web Crypto API)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Documentation**: cmdocs (MDX)

---

## 📖 Bắt Đầu

Để tìm hiểu chi tiết về cách cài đặt và phát triển, vui lòng tham khảo tài liệu tại thư mục [`orion-docs`](./orion-docs) hoặc truy cập [Orion Developer Portal](https://docs.orion.com).

---

Built with ❤️ for **CommandOSS Hackathon** by Mysten Labs.
