import Link from "next/link"
import Image from "next/image"

export default function Header()
{
    return (<div className="border-black/10 border-b h-[40x] flex items-center justify-between px-5">
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
        <ul className="flex items-center gap-2 sm:gap-5">
            <li className="transition-transform duration-200 hover:scale-110">
                <Link href= '/'>Home</Link>
            </li>
            <li className="transition-transform duration-200 hover:scale-110">
                <Link href= '/posts'>Post</Link>
            </li>
            <li className="transition-transform duration-200 hover:scale-110">
                <Link href= '/login'>⎆Đăng nhập</Link>
            </li>
        </ul>
    </div>);
}