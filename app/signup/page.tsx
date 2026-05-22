"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SignupPage() {
    const router = useRouter();
    const { signup, isAuthenticated, isBootstrapping } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isBootstrapping && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isBootstrapping, router]);

    const handleSubmit = async (values: AuthFormValues) => {
        if (!values.name) {
            setError("Name is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await signup({ name: values.name, email: values.email, password: values.password });
            router.push("/login");
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : "Unable to create account";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navigation actionLabel="Sign in" actionHref="/login" />
            <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-4 py-12 md:px-8">
                <AuthForm mode="signup" onSubmit={handleSubmit} loading={loading} serverError={error} />
            </section>
        </div>
    );
}