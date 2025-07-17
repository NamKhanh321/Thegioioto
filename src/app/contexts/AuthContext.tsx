'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type User = {
  id: string;
  username: string;
  name?: string;
  role: "customer" | "admin" | "staff";
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  // On initial load, try to fetch the user
  useEffect(() => {
    // ... (same as before, fetches user from /api/auth/me)
    const fetchUser = async () => {
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/me`, {credentials: 'include'});
        const res = await fetch('/api/me'); // <-- CHANGE THIS
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ The Login Logic
  const login = async (username: string, password: string) => {
  setIsLoading(true);
  const response = await fetch('/api/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    // credentials: 'include', // not needed for same-origin API routes
  });

  const data = await response.json();

  if (response.ok) {
    // Wait for the cookie to be set and /api/me to return the user
    let userData = null;
    for (let i = 0; i < 5; i++) { // Try up to 5 times
      const meRes = await fetch('/api/me');
      if (meRes.ok) {
        userData = await meRes.json();
        break;
      }
      await new Promise(res => setTimeout(res, 200)); // Wait 200ms before retry
    }
    if (userData) {
      setUser(userData);
      router.push(redirectTo);
    } else {
      setUser(null);
      throw new Error("Đăng nhập thất bại: Không thể xác thực người dùng.");
    }
  } else {
    setIsLoading(false);
    throw new Error(data.msg || 'Không thể đăng nhập');
  }
  setIsLoading(false);
};
  // const login = async (username: string, password: string) => {
  //   // 1. Make a request to your Express backend
  //   setIsLoading(true);
  //   // const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`, {
  //           const response = await fetch('/api/login', { // <-- CHANGE THIS
  //               method: "POST",
  //               headers: {
  //                   "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({ username, password }),
  //               // credentials: 'include',
  //           });

  //   const data = await response.json();

  //   if (response.ok) {
  //     // 2. If login is successful, update the user state
  //     setUser(data);
  //     // 3. Redirect to the dashboard
  //     router.push(redirectTo);
  //     setIsLoading(false);
  //   } else {
  //     // Handle login errors (e.g., show a toast notification)
  //     setIsLoading(false);
  //     throw new Error(data.msg || 'Không thể đăng nhập');
  //   }
  // };

  // ✅ The Logout Logic
  const logout = async () => {
    // 1. Tell the backend to clear the httpOnly cookie
    // await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    await fetch('/api/logout', { method: 'POST' }); // <-- CHANGE THIS

    // 2. Clear the user state in the app
    setUser(null);
    // 3. Redirect to the login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook remains the same
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}