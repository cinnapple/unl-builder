declare namespace NodeJS {
  interface Global {}
}

interface IConfig {
  demo: boolean;
  xrptipbot: {
    amount: number;
    to: string;
    network: "twitter";
  };
}
