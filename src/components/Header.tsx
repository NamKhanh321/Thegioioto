"use client"
import Link from "next/link"
import Image from "next/image"

import { useAuth } from "@/app/contexts/AuthContext";
// import { useEffect, useState } from "react";

export default function Header()
{
    const { user, isLoading, logout } = useAuth();

    // const [mounted, setMounted] = useState(false);
    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    const handleLogout = async () => {
        await logout();
    }
    return (<div className="border-black/10 border-b h-[40px] flex items-center justify-between px-5 bg-gray-300">
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
            {/* {!mounted ||  */}
            {isLoading ? (
    // Optionally, show a skeleton or nothing while loading
    <li className="text-gray-400 animate-pulse">...</li>
  ) : user ? (
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
  ) : (
    <li className="transition-transform duration-200 hover:scale-110">
      <Link href="/login">⎆Đăng nhập</Link>
    </li>
  )}
</ul>
    </div>);
}