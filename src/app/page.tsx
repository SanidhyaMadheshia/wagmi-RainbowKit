// "use client";

// import Image from "next/image";

// import { ConnectBtn } from "../components/connectButton";
// import Profile from "../components/profile";
// import { MintToken } from "@/components/MintToken";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div>

      
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <ConnectBtn />

//       {/* <MintToken/> */}
//       </div>
//       <Profile />
//       </div>
//     </main>
//   );
// }

"use client";

import Image from "next/image";
import { ConnectBtn } from "@/components/connectButton";
import Profile from "@/components/profile";
import { MintToken } from "@/components/MintToken";
import { useAccount } from "wagmi";
import { MintTokenDetails } from "@/components/MintTokenDetails";
import { CounterComponent } from "@/components/Counter";

export default function Home() {
  const {address}= useAccount(); // Replace with actual connection logic
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ConnectBtn />
      </div>
      {address}
      {/* <MintTokenDetails/> */}
      <CounterComponent />
    </main>
  );
}