import { compat, types as T } from "../deps.ts";

// Define a custom type for T.Config to include the 'bitcoind' property with a 'type' property
interface CustomConfig extends T.Config {
  bitcoind?: {
    type?: string;
  };
}
// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: CustomConfig,
) => {
  // add dependency on bitcoind or bitcoind-testnet
  const depsBitcoindMainnet: { [key: string]: string[] } =
    newConfig?.bitcoind?.type === "mainnet" ? { bitcoind: [] } : {};
  const depsBitcoindTestnet: { [key: string]: string[] } =
    newConfig?.bitcoind?.type === "testnet" ? { "bitcoind-testnet": [] } : {};

  return compat.setConfig(effects, newConfig, {
    ...depsBitcoindMainnet,
    ...depsBitcoindTestnet,
  });
};
