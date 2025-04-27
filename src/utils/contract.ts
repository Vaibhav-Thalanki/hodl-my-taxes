// utils/contract.ts
import { getContract } from "viem";
import { publicClient, getWalletClient } from "./viem";
import GameTaxABI from "../../abis/GameTax.json";

// Read the address from env — this must match what you set in .env
const address = process.env.NEXT_PUBLIC_GAME_TAX_ADDRESS;
if (!address) {
  throw new Error("Missing NEXT_PUBLIC_GAME_TAX_ADDRESS in environment");
}

export const GAME_TAX_ADDRESS = address;
export const GAME_TAX_ABI = GameTaxABI;

export function getGameTaxContract() {
  return getContract({
    address: GAME_TAX_ADDRESS,
    abi: GAME_TAX_ABI,
    client: publicClient,
  });
}

export async function getGameTaxSigner() {
  const walletClient = await getWalletClient();
  return getContract({
    address: GAME_TAX_ADDRESS,
    abi: GAME_TAX_ABI,
    client: walletClient,
  });
}
