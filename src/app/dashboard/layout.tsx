import Image from "next/image";
import SearchForm from "@/app/(homepage)/components/search-form";
import Link from 'next/link';
export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Navbar */}
      <aside className="w-64 bg-gray-700 text-white border-r flex flex-col">
        <div className="p-6 flex flex-col items-center">
          <Image width={120} height={60} src="/logo-thegioioto.png" alt="the gioi o to" className="mb-4" />
          <SearchForm />
        </div>
        <nav className="flex-1">
          <ul className="list-none m-0 p-0 flex flex-col items-start mx-2 gap-2">
            <li className="relative group w-full">
              <Link href="/dashboard/" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Bảng điều khiển
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/productType" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Loại sản phẩm
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/storage" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Quản lý kho
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/import" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Nhập kho
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/product" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Sản phẩm
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/provider" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Nhà cung cấp
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/order" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Đơn hàng
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/dashboard/account" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Tài khoản
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="relative group w-full">
              <Link href="/shopping" className="block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600">
                Trang mua hàng
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            {/* Add other menu items here */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
    // <>
    //     <div className="mb-6 sm:flex items-center">
    //         <div className="sm:flex md:shrink-0">
    //           <Image width={200} height={100} src="/logo-thegioioto.png" alt="the gioi o to" className="flex place-self-center sm:place-self-start"></Image>
    //         </div>
    //         <div className="sm:flex-2/3 sm:ml-10 md:ml-20 lg:ml-30 xl:ml-75 2xl:ml-100">
    //           <SearchForm />
    //         </div>
    //     </div>
    //     <div className="text-center sticky top-0 z-20 bg-white">
    //         <nav className="mt-5 mb-5 sm:text-xl">
    //         <ul className="list-none m-0 p-0 flex flex-col items-start mx-2 bg-gray-500 justify-center gap-5 flex-wrap">
    //             <li className="relative group">
    //               <Link href="/" className="transition-colors duration-200 hover:text-blue-600">
    //               Bảng điều khiển<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/introduce" className="transition-colors duration-200 hover:text-blue-600">
    //               Loại sản phẩm<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/shopping" className="transition-colors duration-200 hover:text-blue-600">
    //               Quản lý kho<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/category" className="transition-colors duration-200 hover:text-blue-600">
    //               Nhập kho<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
    //               Sản phẩm<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
    //               Nhà cung cấp<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
    //               Đơn hàng<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
    //               Tài khoản<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //             <li className="relative group">
    //               <Link href="/service" className="transition-colors duration-200 hover:text-blue-600">
    //               Trang mua hàng<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
    //               </Link>
    //             </li>
    //         </ul>
    //         </nav>
    //         <div className="min-h-screen">
    //         {children}
    //         </div>
    //     </div>
        
        
    // </>
        
  );
}
