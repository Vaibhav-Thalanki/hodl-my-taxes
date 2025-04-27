// utils/contract.ts
import { getContract } from "viem";
import { publicClient, getWalletClient } from "./viem";
import GameTaxABI from "../../abis/GameTax.json";

export const GAME_TAX_ADDRESS = "0x1E9000Ca539862780096f91b8DD8D0B53d6f50ca";
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
