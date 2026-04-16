# Liquify Payment Infrastructure (SuiPay/SePay for Sui)

Liquify is a decentralized payment infrastructure designed to bridge the Sui blockchain with traditional SaaS and E-commerce business logic. It provides a professional "Stripe-like" experience for both one-time and recurring payments.

## 🏗️ Architecture Overview

The system consists of three distinct layers:

### 1. The Protocol Layer (Move Smart Contracts)
- **Shared Objects**: Subscription permissions and payment records are stored on-chain.
- **Metadata Passthrough**: Every transaction carries an arbitrary `metadata` string (e.g., Order ID, User ID) provided by the merchant.
- **Atomic Execution**: Payments are settled instantly with deterministic finality.

### 2. The Infrastructure Layer (SaaS Gateway)
- **Event Indexer**: A high-performance Node.js service that monitors the blockchain for `PaymentCollected` events.
- **Webhook Dispatcher**: Automatically notifies merchant servers when a payment is confirmed, passing back the original `metadata`.
- **Merchant API Management**: Provides merchants with API Keys and a way to configure their Webhook endpoints.

### 3. The Integration Layer (SDK & Hosted Checkout)
- **SDK**: A simple library for merchants to generate signed Checkout URLs programmatically.
- **Hosted Checkout**: A premium, secure page where customers connect their wallets and authorize payments without leaving the merchant's ecosystem flow.

## 🔄 The Data Flow (SePay Style)

1. **Initiation**: Merchant generates a signed URL with an `orderId` (metadata).
2. **Payment**: Customer signs the transaction on the Liquify Hosted Checkout page.
3. **Storage**: The `orderId` is locked on-chain within the transaction data.
4. **Notification**: The Liquify Gateway detects the transaction and "shoots" a Webhook back to the Merchant's server.
5. **Fulfillment**: Merchant's server receives the Webhook and grants access to the customer immediately.

## 🚀 Key Features

- **Decentralized Recurring Billing**: Secure, non-custodial pulls for subscriptions.
- **Webhook Reliability**: Atomic on-chain events ensure no payment is missed.
- **Scalable Indexing**: Built to handle thousands of concurrent checkouts.
- **Zero Configuration for Customers**: No need for customers to manage accounts; their Sui wallet is their identity.
