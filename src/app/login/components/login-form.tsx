'use client';

import Image from "next/image";
import Link from "next/link"

import { useState } from 'react';
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const {login, isLoading} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError("Vui lòng nhập đủ tài khoản và mật khẩu");
            return;
        }

        try {
            // This fetch call runs in the browser
            await login(username, password);

    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Đã xảy ra lỗi không xác định");
        }
    }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-xs mx-auto mt-8 p-4 bg-gray-600 text-white sm:text-lg rounded shadow"
        >
            <Image src="/logo-thegioioto.png" alt="login logo" width={200} height={200} className="self-center"></Image>
            <div className="gap-3 mb-4">
                <div className="flex flex-col">
                    <label htmlFor="username" className="">Tên đăng nhập:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="">Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full max-w-30 self-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 shadow hover:from-blue-600 hover:to-blue-800 transition"
                disabled={isLoading} // Disable button trong lúc chờ xử lý
            >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <div className="mt-4">Chưa có tài khoản? <Link href="/register" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">Đăng ký ngay</Link></div>
            <p className={`text-red-600 text-center mt-2 ${error ? 'visible' : 'invisible h-0'}`}>
                {error}
            </p>
        </form>
    );
}