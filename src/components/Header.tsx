"use client"
import Link from "next/link"
import Image from "next/image"

import { useAuth } from "@/app/contexts/AuthContext";

export default function Header()
{
    const { user, isLoading, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    // Determine the content to display for the dynamic part
    let dynamicContent;
    if (isLoading) {
        // Show a placeholder that reserves enough space for the longest possible text
        // You might need to adjust this width based on your actual font and text lengths
        dynamicContent = (
            <li className="text-gray-400 animate-pulse min-w-[120px] text-right">Đang tải...</li>
            // min-w-[Xpx] is crucial here. Adjust X based on the combined width of "Trang quản trị" and "Đăng Xuất"
        );
    } else if (user) {
        dynamicContent = (
            <>
                {user.role === "admin" && (
                    <li className="transition-transform duration-200 hover:scale-110">
                        <Link href="/dashboard">Trang quản trị</Link>
                    </li>
                )}
                <li className="transition-transform duration-200 hover:scale-110">
                    <button onClick={handleLogout} className="text-inherit no-underline hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit">
                        ⎆Đăng Xuất
                    </button>
                </li>
            </>
        );
    } else {
        dynamicContent = (
            <li className="transition-transform duration-200 hover:scale-110">
                <Link href="/login">⎆Đăng nhập</Link>
            </li>
        );
    }

    return (
        <div className="border-black/10 border-b h-[40px] flex items-center justify-between px-5 bg-gray-300">
            <Link href= '/' className="transition-transform duration-200 hover:scale-110">
                <Image
                src="/globe.svg"
                alt="logo"
                width={30}
                height={30}
                className="rounded-full"
                />
            </Link>
            <ul className="flex items-center gap-2 sm:gap-5 sm:text-xl">
                <li className="transition-transform duration-200 hover:scale-110">
                    <Link href= '/'>Home</Link>
                </li>
                {dynamicContent} {/* Render the determined content */}
            </ul>
        </div>
    );
}