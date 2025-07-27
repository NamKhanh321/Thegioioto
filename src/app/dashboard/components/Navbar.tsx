'use client'; // This directive makes it a client component

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchForm from '@/app/(homepage)/components/search-form'; // Adjust path as needed
import { Menu, X } from 'lucide-react'; // Using lucide-react for icons
import { usePathname } from 'next/navigation';

const navLinks = [
  {name: "Bảng điều khiển", href:"/dashboard"},
  {name: "Loại sản phẩm", href:"/dashboard/productType"},
  {name: "Quản lý kho", href:"/dashboard/storage"},
  {name: "Nhập kho", href:"/dashboard/import"},
  {name: "Sản phẩm", href:"/dashboard/product"},
  {name: "Nhà cung cấp", href:"/dashboard/provider"},
  {name: "Đơn hàng", href:"/dashboard/order"},
  {name: "Tài khoản", href:"/dashboard/account"},
  {name: "Trang mua hàng", href:"/shopping"},
]

export default function ClientSidebar() {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the sidebar, to be called on link click
  const closeSidebar = () => {
    if (window.innerWidth < 1024) { // Only close if on small screens (less than lg breakpoint)
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden fixed top-10 left-1 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-gray-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-700 text-white border-r flex flex-col z-50
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:flex lg:min-h-screen
          transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex flex-col items-center">
          {/* Close button for small screens inside the sidebar */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <Image
            width={120}
            height={60}
            src="/logo-thegioioto.png" // Placeholder for logo-thegioioto.png
            alt="the gioi o to"
            className="mb-4 rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/logo-thegioioto.png";
            }}
          />
          {/* SearchForm component */}
          <SearchForm />
        </div>
        <nav className="flex-1 overflow-y-auto pb-4">
          <ul className="list-none m-0 p-0 flex flex-col items-start mx-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (<li className="relative group w-full" key={link.name}>
              <Link
                href={link.href}
                className={`${isActive && 'font-bold bg-gray-800'} block w-full px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600`}
                onClick={closeSidebar} // Added onClick handler
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-[width] duration-300 group-hover:w-full"></span>
              </Link>
            </li>);
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
