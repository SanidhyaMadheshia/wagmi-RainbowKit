import React, { useState } from 'react';
import { Coins, Send, UserPlus, Wallet } from 'lucide-react';
import { useAccount, useBalance, useWriteContract  , useWaitForTransactionReceipt} from 'wagmi';
import { Button } from './ui/button';
import { abi } from '@/lib/abi';
export const MintToken = () => {


  // const {address} = useAccount();
  const {address} = useAccount();
    const isConnected = Boolean(address);
    const {data: balance} = useBalance({
        address: address,
        query: {
            enabled: isConnected,
        },
    });
  
  const [activeTab, setActiveTab] = useState('mint');
  const [userAddress, setUserAddress] = useState(address);
  const [isOwner, setIsOwner] = useState(false);
  if(userAddress === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
    setIsOwner(true);
  }
  // const result = useBalance({
  //   address : userAddress,
  // });


  // const [balance, setBalance] = useState();
  
  // Mock token data
  const [tokenSymbol] = useState('MTK');
  const [tokenName] = useState('MyToken');
  
  // Form states
  const [mintAmount, setMintAmount] = useState('');
  const [mintToAddress, setMintToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferToAddress, setTransferToAddress] = useState('');
  
  // Mock transactions
  const [txHistory, setTxHistory] = useState([
    { type: 'mint', amount: '500', to: '0xabcd...efgh', hash: '0x1234...', timestamp: '2 mins ago' },
    { type: 'transfer', amount: '100', to: '0x9876...5432', hash: '0x5678...', timestamp: '5 mins ago' },
  ]);

  const { data: hash, writeContract } = useWriteContract();
  const handleMint = async () => {
    if (!mintAmount || !mintToAddress) return;

    writeContract({
      abi : abi,
      address : address,
      function : 'mintTokens',
      args : [address, 100000]


    })
    
    
    setTxHistory([newTx, ...txHistory]);
    setMintAmount('');
    console.log(hash);
    setMintToAddress('');
  };

  const handleTransfer = () => {
    if (!transferAmount || !transferToAddress) return;
    
    const newTx = {
      type: 'transfer',
      amount: transferAmount,
      to: transferToAddress,
      hash: '0x' + Math.random().toString(16).substr(2, 8) + '...',
      timestamp: 'Just now'
    };
    
    setTxHistory([newTx, ...txHistory]);
    setTransferAmount('');
    setTransferToAddress('');
  };

  // console.log(result.data);

  // const {}= useWaitForTransactionReceipt();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
    
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">{tokenName} ({tokenSymbol})</h1>
                <p className="text-gray-400">ERC20 Token Management</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Connected Account</div>
              <div className="font-mono text-sm">{userAddress}</div>
              <div className="text-xs text-green-400">{isOwner ? 'Contract Owner' : 'User'}</div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Your Balance</span>
              </div>
              <div className="text-2xl font-bold text-blue-400"> {tokenSymbol}</div>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setIsOwner(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isOwner ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Contract Owner
            </button>
            <button
              onClick={() => setIsOwner(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !isOwner ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Panel */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2">
                {isOwner && (
                  <button
                    onClick={() => setActiveTab('mint')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'mint' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Mint Tokens
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'transfer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Transfer Tokens
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'mint' && isOwner && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">Mint New Tokens</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={mintToAddress}
                      onChange={(e) => setMintToAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleMint}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Mint Tokens
                  </button>
                </div>
              )}

              {activeTab === 'transfer' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Send className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Transfer Tokens</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={transferToAddress}
                      onChange={(e) => setTransferToAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={handleTransfer}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Transfer Tokens
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {txHistory.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'mint' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type === 'mint' ? <UserPlus className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-400">To: {tx.to}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{tx.amount} {tokenSymbol}</div>
                      <div className="text-xs text-gray-400">{tx.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {result} */}
      {/* <</Button> */}
      {isConnected ? (
                <div>
                    <p>Address: {address}</p>
                    <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                </div>
            ) : (
                <p>Please connect your wallet to view details.</p>
            )}
      
    </div>
  );
};

// export default ERC20TokenManager;