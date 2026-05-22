"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { signin, isAuthenticated, isBootstrapping } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isBootstrapping && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isBootstrapping, router]);

    const handleSubmit = async (values: AuthFormValues) => {
        try {
            setLoading(true);
            setError(null);
            await signin({ email: values.email, password: values.password });
            router.push("/dashboard");
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : "Unable to sign in";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navigation actionLabel="Create account" actionHref="/signup" />
            <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-4 py-12 md:px-8">
                <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} serverError={error} />
            </section>
        </div>
    );
}