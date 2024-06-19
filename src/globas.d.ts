// src/global.d.ts
export {}; // Ensure this file is a module

declare global {
  interface Window {
    unisat: {
      requestAccounts: () => Promise<string[]>;
      getAccounts: () => Promise<string[]>;
      getPublicKey: () => Promise<string>;
      getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>;
      getNetwork: () => Promise<string>;
      signPsbt: (rawTx: any) => Promise<string>;  // Here you may want to define the type more specifically
      pushTx: (options: { rawtx: string }) => Promise<string>;

    };
  }
}
