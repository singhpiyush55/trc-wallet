"use client";

import Link from "next/link";

type NavigationProps = {
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
};

export default function Navigation({ actionLabel, actionHref, onActionClick }: NavigationProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          TRC Wallet
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Dashboard
          </Link>
          {actionLabel && onActionClick ? (
            <button
              type="button"
              onClick={onActionClick}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {actionLabel}
            </button>
          ) : null}
          {actionLabel && actionHref && !onActionClick ? (
            <Link
              href={actionHref}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
