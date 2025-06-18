"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "@/lib/counterAbi"; // your Counter ABI
import { Button } from "./ui/button";

const CONTRACT_ADDRESS = "0x71C95911E9a5D330f4D621842EC243EE1343292e";

export function CounterComponent() {
  const { address, isConnected } = useAccount();

  const [pendingTx, setPendingTx] = useState<`0x${string}` | null>(null);

  const { data: count } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "get",

  });

  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: pendingTx,
  });

  async function handleWrite(functionName: "inc" | "dec") {
    try {
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName,
      });
      setPendingTx(txHash);
      console.log(`${functionName} tx sent:`, txHash);
    } catch (err) {
      console.error(`${functionName} failed:`, err);
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧮 Counter</h2>
      {isConnected ? (
        <>
          <p className="mb-4 text-lg">Current Count: {count?.toString() ?? "Loading..."}</p>
          <div className="flex gap-4">
            <Button disabled={isConfirming} onClick={() => handleWrite("inc")}>
              {isConfirming ? "Confirming..." : "Increment"}
            </Button>
            <Button disabled={isConfirming} onClick={() => handleWrite("dec")}>
              {isConfirming ? "Confirming..." : "Decrement"}
            </Button>
          </div>
          {isConfirmed && (
            <p className="text-green-600 mt-3">✅ Transaction confirmed!</p>
          )}
        </>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}
