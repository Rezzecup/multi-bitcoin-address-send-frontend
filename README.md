# Bitcoin/Ordinal Multiple Addresses Sending Frontend

This project is a Bitcoin/Ordinal multiple addresses sending frontend built using Next.js. It leverages `psbt` for partially signed Bitcoin transactions, manages UTXOs (Unspent Transaction Outputs), and supports Ordinals/inscriptions. Below you'll find a comprehensive README to help you understand, set up, and use the project.

---

## Overview
This project provides a web application for sending Bitcoin and Ordinals to multiple addresses using a modern frontend framework - Next.js. It emphasizes handling multiple addresses and UTXO management efficiently. The application ensures secure transaction signing through `psbt` and maintains a smooth user experience.

## Features
- **Next.js**: Fast and scalable React framework.
- **PSBT (Partially Signed Bitcoin Transactions)**: For creating and managing secure transactions.
- **UTXO Management**: Efficiently tracks and uses UTXOs for transactions.
- **Ordinals/Inscription**: Supports Bitcoin Ordinals and inscriptions.
- **Multiple Address Handling**: Send transactions to multiple addresses from a single source.
- **Testnet Support**: For development and testing purposes.
- **Secure Environment Configuration**: Utilizes `.env` for storing sensitive information.

## Configuration
Create a `.env` file in the root directory and add the following environment variables:

## Usage
Start the development server.

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to use the application.

### Creating and Sending a Transaction
1. Generate addresses on the specified endpoint.
2. Input the recipient addresses and amounts.
3. Create and sign the transaction using PSBT.
4. Broadcast the transaction to the Bitcoin network.

### Manage UTXOs
- List all available UTXOs.
- Select UTXOs for creating transactions to optimize fees and handling.

### Ordinals/Inscription
- Track and manage Ordinals.
- Ensure inscriptions are correctly integrated into the transaction logic.
