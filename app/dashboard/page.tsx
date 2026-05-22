"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navigation from "@/components/layout/Navigation";
import TransferModal from "@/components/modal/TransferModal";
import { useAuth } from "@/components/providers/AuthProvider";
import TransactionList from "@/components/wallet/TransactionList";
import WalletCard from "@/components/wallet/WalletCard";

type WalletResponse = {
    balance: number;
    currency: string;
};

type WalletTransaction = {
    id: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    balanceAfter: number;
    reason: string;
    createdAt: string;
};

type TransactionsResponse = {
    transactions: WalletTransaction[];
};

type ApiResponse = {
    message?: string;
    error?: string;
};

async function getResponseMessage(response: Response, fallback: string): Promise<string> {
    try {
        const data = (await response.json()) as ApiResponse;
        return data.message ?? data.error ?? fallback;
    } catch {
        return fallback;
    }
}

export default function DashboardPage() {
    const router = useRouter();
    const { signout, refreshSession } = useAuth();

    const [wallet, setWallet] = useState<WalletResponse | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [transferOpen, setTransferOpen] = useState(false);

    const handleUnauthorized = useCallback(async () => {
        const authenticated = await refreshSession();
        if (!authenticated) {
            router.replace("/login");
        }
    }, [refreshSession, router]);

    const loadWalletData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [walletResponse, transactionsResponse] = await Promise.all([
                fetch("/api/wallet/balance", { credentials: "include" }),
                fetch("/api/wallet/transactions", { credentials: "include" }),
            ]);

            if (!walletResponse.ok || !transactionsResponse.ok) {
                if (walletResponse.status === 401 || transactionsResponse.status === 401) {
                    await handleUnauthorized();
                    return;
                }

                const message = walletResponse.ok
                    ? await getResponseMessage(transactionsResponse, "Unable to fetch transactions")
                    : await getResponseMessage(walletResponse, "Unable to fetch wallet balance");
                setError(message);
                return;
            }

            const walletData = (await walletResponse.json()) as WalletResponse;
            const transactionData = (await transactionsResponse.json()) as TransactionsResponse;

            setWallet(walletData);
            setTransactions(transactionData.transactions ?? []);
        } catch {
            setError("Something went wrong while loading the dashboard");
        } finally {
            setLoading(false);
        }
    }, [handleUnauthorized]);

    useEffect(() => {
        void loadWalletData();
    }, [loadWalletData]);

    useEffect(() => {
        if (!toast) {
            return;
        }
        const timer = window.setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const submitWalletOperation = useCallback(
        async (endpoint: string, payload: Record<string, unknown>, successText: string) => {
            setActionLoading(endpoint);
            setError(null);
            setToast(null);

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });

                let data: ApiResponse = {};
                try {
                    data = (await response.json()) as ApiResponse;
                } catch {
                    data = {};
                }

                if (!response.ok) {
                    if (response.status === 401) {
                        await handleUnauthorized();
                        return false;
                    }

                    throw new Error(data.message ?? data.error ?? "Wallet operation failed");
                }

                setToast({ type: "success", message: data.message ?? successText });
                await loadWalletData();
                return true;
            } catch (actionError) {
                const message = actionError instanceof Error ? actionError.message : "Wallet operation failed";
                setError(message);
                setToast({ type: "error", message });
                return false;
            } finally {
                setActionLoading(null);
            }
        },
        [handleUnauthorized, loadWalletData],
    );

    const handleTransfer = async (values: { key: string; coins: number }) => {
        const success = await submitWalletOperation("/api/wallet/transfer", values, "Transfer completed");
        if (success) {
            setTransferOpen(false);
        }
    };

    const handleSignout = async () => {
        await signout();
        router.replace("/login");
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <Navigation actionLabel="Sign out" onActionClick={handleSignout} />

                <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
                            <p className="text-sm text-slate-600">Manage wallet balance and transfers from one place.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTransferOpen(true)}
                            className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
                        >
                            New transfer
                        </button>
                    </div>

                    {error ? <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

                    {loading || !wallet ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">Loading wallet data...</div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                            <div className="space-y-6">
                                <WalletCard balance={wallet.balance} currency={wallet.currency} />
                            </div>

                            <TransactionList transactions={transactions} />
                        </div>
                    )}
                </section>

                <TransferModal
                    open={transferOpen}
                    onClose={() => setTransferOpen(false)}
                    onSubmit={handleTransfer}
                    loading={actionLoading === "/api/wallet/transfer"}
                />

                {toast ? (
                    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
                        <p
                            className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
                                toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
                            }`}
                        >
                            {toast.message}
                        </p>
                    </div>
                ) : null}
            </div>
        </ProtectedRoute>
    );
}