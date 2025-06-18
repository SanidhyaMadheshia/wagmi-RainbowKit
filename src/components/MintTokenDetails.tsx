// import { useAccount, useBalance, useSendTransaction , useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// import { Button } from "./ui/button";
// import { parseEther } from "viem";
// import { writeContract } from "viem/actions";
// import { abi } from "@/lib/abi";
// import { useReadContract } from 'wagmi'

// export const MintTokenDetails=()=> {
//     const {address} = useAccount();
//     const isConnected = Boolean(address);
//     const {data: balance} = useBalance({
//         address: address,
//         query: {
//             enabled: isConnected,
//         },
//     });
//       const { data: hash, sendTransaction } = useSendTransaction();
//     const {data:hash2 ,  writeContract } = useWriteContract();

//     const {  data: TokenBalance } = useReadContract({
//         address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//         abi: abi,
//         functionName: 'balanceOf',
//         args: [address],
//         query : {
//             enabled : !!address
//         }
//     })
//     function ReadContract() {

//         console.log("Reading contract...");
//         console.log("Token Balance:", TokenBalance);
//     }
//     console.log("balance", balance);
//     console.log("address", address);    
//     async function sendEth() {
//         sendTransaction({to : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" , value: parseEther("1") });
//         console.log("Transaction sent:", hash);
//     }
//     async function sendToken() {
//         if (!address) {
//             console.error("Address is undefined");
//             return;
//         }
//         writeContract({
//             address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//             abi: abi,
//             functionName: "mintTokens",
//             args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", BigInt(1000)]
//         });
//     }
//     const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({
//       hash,
//     });
//     useWaitForTransactionReceipt({
//         hash: hash2
//     });




//     return (
//         <div>
//             <h2 className="text-2xl font-bold mb-4">Mint Token Details</h2>
//             {isConnected ? (
//                 <div>
//                     <p>Address: {address}</p>
//                     <p>Balance: {balance?.formatted} {balance?.symbol}</p>
//                 </div>
//             ) : (
//                 <p>Please connect your wallet to view details.</p>
//             )}
//             <Button onClick={sendEth}>send 1 eth</Button>
//             {/* {isConfirming && <div>Waiting for confirmation...</div>}
//             {isConfirmed && <div>Transaction confirmed.</div>} */}
//             <Button onClick={sendToken}>send the tokens </Button>

//             {/* {isConfirming && <div>Waiting for confirmation...</div>}
//       {isConfirmed && <div>Transaction confirmed.</div>} */}
//             <Button onClick={ReadContract}>Read Contract</Button>
//             <div className="mt-4">
//                 <p>Transaction Hash: {hash?.toString()}</p>
//                 <p>Transaction Hash2: {hash2?.toString()}</p>
//             </div>
//         </div>
//     )
// }


"use client";

import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useWriteContract, useReadContract } from "wagmi";
import { Button } from "./ui/button";
import { parseEther } from "viem";
import {abi} from "@/lib/abi"; // replace with your actual ABI path

const CONTRACT_ADDRESS = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

export const MintTokenDetails = () => {
  const { address } = useAccount();
  const isConnected = Boolean(address);

  const { data: nativeBalance } = useBalance({
    address,
    query: { enabled: isConnected },
  });

  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"],
    query: { enabled: Boolean(address) },
  });

  const { data: ethHash, sendTransaction } = useSendTransaction();
  const { data: tokenTxHash, writeContract } = useWriteContract();

  const { isLoading: isEthConfirming, isSuccess: isEthConfirmed } = useWaitForTransactionReceipt({ hash: ethHash });
  
  async function sendEth() {
      if (!address) return;
      sendTransaction({
          to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          value: parseEther("1"),
        });
    }
    
    async function sendToken() {
        if (!address) {
            console.error("Wallet not connected.");
            return;
        }

        try {
             writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: "mintTokens",
            args: ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", BigInt(100 * 10 ** 18)], // Replace `address` with a hardcoded one if needed
            });

            console.log("Transaction submitted. Hash:", tokenTxHash);
        } catch (error) {
            console.error("Minting failed:", error);
        }
    }

    const { isLoading: isTokenConfirming, isSuccess: isTokenConfirmed } = useWaitForTransactionReceipt({ hash: tokenTxHash });

  return (
    <div className="p-4 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mint Token Details</h2>

      {isConnected ? (
        <div className="mb-4 space-y-1">
          <p>👤 Address: <span className="font-mono">{address}</span></p>
          <p>💰 ETH Balance: {nativeBalance?.formatted} {nativeBalance?.symbol}</p>
          <p>🪙 Token Balance: {tokenBalance?.toString()}</p>
        </div>
      ) : (
        <p>Please connect your wallet to view token info.</p>
      )}

      <div className="space-y-2">
        <Button onClick={sendEth}>Send 1 ETH</Button>
        {isEthConfirming && <p>Sending ETH...</p>}
        {isEthConfirmed && <p>✅ ETH Sent!</p>}

        <Button onClick={sendToken}>Mint 1000 Tokens</Button>
        {isTokenConfirming && <p>Minting Tokens...</p>}
        {isTokenConfirmed && <p>✅ Tokens Minted!</p>}

        <Button onClick={() => console.log("Token Balance:", tokenBalance)}>Log Token Balance</Button>
      </div>

      <div className="mt-4 space-y-1 text-sm font-mono">
        {ethHash && <p>ETH Tx: {ethHash}</p>}
        {tokenTxHash && <p>Token Tx: {tokenTxHash}</p>}
      </div>
    </div>
  );
};
