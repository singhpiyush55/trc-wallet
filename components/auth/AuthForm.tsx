"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type AuthMode = "login" | "signup";

export type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

type AuthFormProps = {
  mode: AuthMode;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  loading?: boolean;
  serverError?: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ mode, onSubmit, loading = false, serverError = null }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const heading = isSignup ? "Create your account" : "Welcome back";
  const ctaLabel = isSignup ? "Create account" : "Sign in";

  const alternateLink = useMemo(
    () =>
      isSignup
        ? { href: "/login", text: "Already have an account? Sign in" }
        : { href: "/signup", text: "Need an account? Create one" },
    [isSignup],
  );

  const validate = () => {
    if (isSignup && name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);

    await onSubmit({
      name: isSignup ? name.trim() : undefined,
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 md:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h1>
      <p className="mt-1 text-sm text-slate-500">Use your TradeCoin credentials to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isSignup ? (
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          </label>
        ) : null}

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-cyan-500"
            placeholder="Enter your password"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </label>

        {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
        {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Please wait..." : ctaLabel}
        </button>
      </form>

      <Link href={alternateLink.href} className="mt-4 inline-block text-sm text-cyan-700 hover:text-cyan-900">
        {alternateLink.text}
      </Link>
    </div>
  );
}
