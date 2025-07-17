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
    return (<div className="border-black/10 border-b h-[40x] flex items-center justify-between px-5 bg-gray-300">
        <Link href= '/' className="transition-transform duration-200 hover:scale-110">
            <Image 
            src="/globe.svg"
            alt="logo"
            width={30}
            height={30}
            className="rounded-full"
            priority
            />
        </Link>
        <ul className="flex items-center gap-2 sm:gap-5 sm:text-xl">
            <li className="transition-transform duration-200 hover:scale-110">
                <Link href= '/'>Home</Link>
            </li>
                {!isLoading && user &&             
                <li className="transition-transform duration-200 hover:scale-110">
                    <Link href= '/dashboard'>Trang quản trị</Link>
                </li>
                }
            <li className="transition-transform duration-200 hover:scale-110">
                {/* Render based on loading state first, then user state */}
                    {isLoading ? (
                        // Placeholder while loading
                        <span>Loading...</span>
                    ) : !user ? (
                        // If not loading and no user, show login
                        <Link href="/login">⎆Đăng nhập</Link>
                    ) : (
                        // If not loading and user exists, show logout
                        <button onClick={handleLogout} className="text-inherit no-underline hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit">
                            ⎆Đăng Xuất
                        </button>
                    )}
            </li>
        </ul>
    </div>);
}