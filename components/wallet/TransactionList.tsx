type WalletTransaction = {
  id: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
};

type TransactionListProps = {
  transactions: WalletTransaction[];
};

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">History</span>
      </div>

      {transactions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No transactions yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => {
            const isCredit = tx.type === "CREDIT";
            return (
              <li key={tx.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">{tx.reason}</p>
                  <p className={`text-sm font-semibold ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                    {isCredit ? "+" : "-"}
                    {amountFormatter.format(tx.amount)}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <p>{new Date(tx.createdAt).toLocaleString()}</p>
                  <p>After: {amountFormatter.format(tx.balanceAfter)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
