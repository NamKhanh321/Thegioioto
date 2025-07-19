'use client';

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import {registerUser} from "@/actions/actions";

export default function RegisterForm() {
    const [state, action, isLoading] = useActionState(registerUser, {
        error: "",
        username: "",
        password: "",
        name: "",
    });

    return (
        <form
            action={action}
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
                        defaultValue={state.username}
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
                        defaultValue={state.password}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="">Nhập lại mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-400"
                        defaultValue={state.password}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="">Họ và tên:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="border border-gray-300 rounded p-1 focus:outline-none focus:border-blue-400"
                        defaultValue={state.name}
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full max-w-50 self-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 shadow hover:from-blue-600 hover:to-blue-800 transition"
                disabled={isLoading} // Disable button trong lúc chờ xử lý
            >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <div className="mt-4">Đã có tài khoản? <Link href="/login" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">Đăng nhập</Link></div>
            {state.error && (
                <p className="text-red-600 text-center mt-2">{state.error}</p>
            )}
        </form>
    );
}