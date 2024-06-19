import Image from "next/image";
import ConnectWalletBtn from "./components/ConnectWalletBtn";

export default function Home() {
  return (
    <main>
      <h1>Send Multi Addresses</h1>
      <ConnectWalletBtn />
    </main>
  );
}
