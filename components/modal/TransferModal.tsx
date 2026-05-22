"use client";

import { useState } from "react";

type TransferModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { key: string; coins: number }) => Promise<void>;
  loading?: boolean;
};

export default function TransferModal({ open, onClose, onSubmit, loading = false }: TransferModalProps) {
  const [key, setKey] = useState("");
  const [coins, setCoins] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedKey = key.trim();
    const amount = Number(coins);

    if (!normalizedKey) {
      setError("Receiver key is required");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    setError(null);
    await onSubmit({ key: normalizedKey, coins: amount });
    setKey("");
    setCoins("");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Transfer funds</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Receiver key
            <input
              type="text"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="e.g. V7j8Qx3Za9"
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={coins}
              onChange={(event) => setCoins(event.target.value)}
              placeholder="500"
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Submitting..." : "Send transfer"}
          </button>
        </form>
      </div>
    </div>
  );
}
