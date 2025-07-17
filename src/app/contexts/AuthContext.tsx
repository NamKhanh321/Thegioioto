'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

import { useRouter } from 'next/navigation';


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
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  // Thử trích xuất user từ cookies hiện tại
  useEffect(() => {
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

    // Kiểm tra token mỗi 1p, có thể gây giảm hiệu suất
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const res = await fetch('/api/me');
  //       if (res.ok) {
  //         const data = await res.json();
  //         setUser(data);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch {
  //       setUser(null);
  //     }
  //   }, 60000); // 60 seconds

  //   return () => clearInterval(interval);
  // }, []);

  // ✅ Login Logic
  const login = async (username: string, password: string) => {
    // 1. Make a request to your Express backend
    setIsLoading(true);
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`, {
        const response = await fetch('/api/login', { // <-- CHANGE THIS
          method: "POST",
          headers: {
            "Content-Type": "application/json",
                },
          body: JSON.stringify({ username, password }),
          // credentials: 'include',
        });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      // 2. update user nếu login thành công
      setUser(data);
      // 3. Chuyển hướng 
      // window.location.href = redirectTo;
      router.push(redirectTo);
      // router.refresh();
      setIsLoading(false);
    } else {
      // Xử lý lỗi login
      setIsLoading(false);
      throw new Error(data.msg || 'Không thể đăng nhập');
    }
  };

  // ✅ Logout Logic
  const logout = async () => {
    // await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setIsLoading(true);
    const response = await fetch('/api/logout', { method: 'POST' }); // <-- CHANGE THIS

    if (response.ok) {
    setUser(null);
    // window.location.href = '/login';
    
    router.push('/login');
    // router.refresh();
    setIsLoading(false);
    }
    else {
      // Xử lý lỗi logout
      setIsLoading(false);
      throw new Error('Không thể đăng xuất');
    }
    
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}