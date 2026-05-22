"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SignInInput = {
  email: string;
  password: string;
};

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  signin: (input: SignInInput) => Promise<void>;
  signup: (input: SignUpInput) => Promise<void>;
  signout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.message ?? data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      const authenticated = response.ok;
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  const signin = useCallback(async ({ email, password }: SignInInput) => {
    const response = await fetch("/api/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Unable to sign in"));
    }

    setIsAuthenticated(true);
  }, []);

  const signup = useCallback(async ({ name, email, password }: SignUpInput) => {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Unable to create account"));
    }
  }, []);

  const signout = useCallback(async () => {
    await fetch("/api/user/signout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isBootstrapping,
      signin,
      signup,
      signout,
      refreshSession,
    }),
    [isAuthenticated, isBootstrapping, signin, signup, signout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
