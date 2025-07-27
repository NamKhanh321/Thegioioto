import ClientSidebar from "@/app/dashboard/components/Navbar";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: {
    default: "Trang quản lý",
    template: "Trang quản lý | %s",
  }
}

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <ClientSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
        
  );
}
