"use client";

import Link from "next/link";
import Navigation from "@/components/layout/Navigation";

export default function LandingPage() { 
    return (
        <div className="min-h-screen">
            <Navigation actionLabel="Sign up" actionHref="/signup" />
            <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
                <div>
                    <p className="inline-block rounded-full border border-cyan-700/20 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                        TradeCoin Wallet
                    </p>
                    <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
                        Move funds across accounts in seconds, with full transaction visibility.
                    </h1>
                    <p className="mt-4 max-w-xl text-base text-slate-600">
                        Create your wallet, review real-time balance, and execute secure transfers from one clean dashboard.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Open account
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4">
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Real-time balance</h2>
                        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">TRC 100,000.00</p>
                        <p className="mt-2 text-sm text-slate-600">Every new wallet starts funded and ready for internal operations.</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Transaction tracking</h2>
                        <p className="mt-2 text-sm text-slate-600">Credit, debit, and transfer events are recorded with timestamp and running balance.</p>
                    </article>
                    <article className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-800">Simple operation flow</h2>
                        <p className="mt-2 text-sm text-cyan-900">Landing page to auth to dashboard, with protected APIs and cookie-backed sessions.</p>
                    </article>
                </div>
            </section>
        </div>
    );
}