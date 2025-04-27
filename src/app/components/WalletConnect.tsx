'use client';

import React, { useState, useEffect } from 'react';
import { assetHub } from '@/utils/viem';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface WalletConnectProps {
    onConnect: (account: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user already has an authorized wallet connection
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = (await window.ethereum.request({
                        method: 'eth_accounts',
                    })) as string[];

                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        const chainIdHex = (await window.ethereum.request({
                            method: 'eth_chainId',
                        })) as string;
                        setChainId(parseInt(chainIdHex, 16));
                        onConnect(accounts[0]);
                    }
                } catch (err) {
                    console.error('Error checking connection:', err);
                    setError('Failed to check wallet connection');
                }
            }
        };
        checkConnection();

        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0] || null);
                if (accounts[0]) onConnect(accounts[0]);
            });
            window.ethereum.on('chainChanged', (chainIdHex: string) => {
                setChainId(parseInt(chainIdHex, 16));
            });
        }
        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => { });
                window.ethereum.removeListener('chainChanged', () => { });
            }
        };
    }, [onConnect]);

    const connectWallet = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setError('MetaMask not detected! Please install MetaMask.');
            return;
        }
        try {
            const accounts = (await window.ethereum.request({
                method: 'eth_requestAccounts',
            })) as string[];
            setAccount(accounts[0]);
            const chainIdHex = (await window.ethereum.request({
                method: 'eth_chainId',
            })) as string;
            const currentChainId = parseInt(chainIdHex, 16);
            setChainId(currentChainId);
            if (currentChainId !== assetHub.id) {
                await switchNetwork();
            }
            onConnect(accounts[0]);
        } catch (err) {
            console.error('Error connecting to wallet:', err);
            setError('Failed to connect wallet');
        }
    };

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${assetHub.id.toString(16)}` }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${assetHub.id.toString(16)}`,
                            chainName: assetHub.name,
                            rpcUrls: [assetHub.rpcUrls.default.http[0]],
                            nativeCurrency: assetHub.nativeCurrency,
                        }],
                    });
                } catch {
                    setError('Failed to add network to wallet');
                }
            } else {
                setError('Failed to switch network');
            }
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔗 Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}

                {!account ? (
                    <Button onClick={connectWallet} variant="outline" className="w-full">
                        Connect Wallet
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Connected:</Label>
                            <code className="font-mono">{`${account.slice(0, 6)}…${account.slice(-4)}`}</code>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={disconnectWallet} variant="ghost" className="flex-1">
                                Disconnect
                            </Button>
                            {chainId !== assetHub.id && (
                                <Button onClick={switchNetwork} variant="destructive" className="flex-1">
                                    Switch to Asset Hub
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WalletConnect;
