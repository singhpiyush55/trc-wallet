type WalletCardProps = {
  balance: number;
  currency: string;
};

const balanceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function WalletCard({ balance, currency }: WalletCardProps) {
  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/30">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Available balance</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight">
        {currency} {balanceFormatter.format(balance)}
      </p>
      <p className="mt-3 text-sm text-slate-300">Funds update instantly after each wallet operation.</p>
    </section>
  );
}
