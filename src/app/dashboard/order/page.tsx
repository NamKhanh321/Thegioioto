import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đơn hàng"
}

export default function orderPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý đơn hàng</h1>
      </div>
  );
}
