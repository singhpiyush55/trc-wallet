"use client";
import Link from "next/link";


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Your Digital Wallet,{" "}
                    <span className="text-emerald-400">Simplified</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                    TRC Wallet is a secure, fast, and easy-to-use digital wallet for
                    managing your TRC currency. Send, receive, and track your funds with
                    complete transparency.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/signup"
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-lg font-semibold transition"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        href="#features"
                        className="px-8 py-4 border border-slate-600 hover:border-slate-400 rounded-lg text-lg transition"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-16">
                    Why Choose TRC Wallet?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon="🔒"
                        title="Bank-Grade Security"
                        description="Your funds are protected with industry-leading encryption and secure authentication."
                    />
                    <FeatureCard
                        icon="⚡"
                        title="Instant Transactions"
                        description="Send and receive TRC currency instantly with real-time balance updates."
                    />
                    <FeatureCard
                        icon="📊"
                        title="Complete Transaction History"
                        description="Track every transaction with detailed history and timestamps."
                    />
                    <FeatureCard
                        icon="🎁"
                        title="Welcome Bonus"
                        description="Start with a generous 100,000 TRC welcome bonus!"
                    />
                    <FeatureCard
                        icon="💳"
                        title="Easy Fund Management"
                        description="Credit and debit your wallet effortlessly with our intuitive interface."
                    />
                    <FeatureCard
                        icon="🌐"
                        title="Access Anywhere"
                        description="Your wallet is available 24/7 from any device."
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-slate-800/50 py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <StepCard step="1" title="Sign Up" description="Create your free account in seconds." />
                        <StepCard step="2" title="Get Your Wallet" description="Automatically created with 100,000 TRC bonus." />
                        <StepCard step="3" title="Start Transacting" description="Credit or debit your wallet instantly." />
                        <StepCard step="4" title="Track & Manage" description="View your complete transaction history." />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl font-bold mb-6">
                    Ready to Take Control of Your Digital Finances?
                </h2>
                <p className="text-xl text-slate-300 max-w-xl mx-auto mb-10">
                    Join thousands of users who trust TRC Wallet. Sign up today!
                </p>
                <Link
                    href="/signup"
                    className="inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xl font-semibold transition"
                >
                    Get Started — It&apos;s Free
                </Link>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {step}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
        </div>
    );
}