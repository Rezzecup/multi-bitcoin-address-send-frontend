// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import ConnectWalletBtn from "./components/ConnectWalletBtn";

const container = document.getElementById("root")!;
const root = createRoot(container); // Create a root.

const App = () => (
  <div>
    <h1>Send Multi Addresses</h1>
    <ConnectWalletBtn />
  </div>
);

root.render(<App />);
