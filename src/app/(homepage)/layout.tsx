import Image from "next/image";
import SearchForm from "@/app/(homepage)/components/search-form";
import Footer from '@/app/(homepage)/components/Footer';
import Link from 'next/link';
export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="mb-6 sm:flex items-center">
            <div className="sm:flex md:shrink-0">
              <Image width={200} height={100} src="/logo-thegioioto.png" alt="the gioi o to" className="flex place-self-center sm:place-self-start"></Image>
            </div>
            <div className="sm:flex-2/3 sm:ml-10 md:ml-20 lg:ml-30 xl:ml-75 2xl:ml-100">
              <SearchForm />
            </div>
        </div>
        <div className="text-center sticky top-0 z-20 bg-white">
            <nav className="mt-5 mb-5 sm:text-xl">
            <ul className="list-none m-0 p-0 flex items-center justify-center gap-5 flex-wrap">
                <li className="relative group">
                  <Link href="/" className="transition-colors duration-200 hover:text-blue-600">
                  Trang chủ<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="relative group">
                  <Link href="/introduce" className="transition-colors duration-200 hover:text-blue-600">
                  Giới thiệu<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="relative group">
                  <Link href="/shopping" className="transition-colors duration-200 hover:text-blue-600">
                  Mua hàng<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="relative group">
                  <Link href="/category" className="transition-colors duration-200 hover:text-blue-600">
                  Danh mục<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="relative group">
                  <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
                  Đặt dịch vụ<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
            </ul>
            </nav>
        </div>
        <div className="min-h-screen">
          {children}
        </div>
        <div className="mt-auto">
            <Footer />
        </div>
        
    </>
        
  );
}
