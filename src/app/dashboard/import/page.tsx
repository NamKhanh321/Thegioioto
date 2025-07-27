// This component is a Server Component by default in Next.js App Router
// No 'use client' directive means it runs on the server.

import React from 'react';
import ImportActions from '@/app/dashboard/import/components/updateAndDelete';
import ImportAddWrapper from './components/add-btnWrapper';
import { cookies } from 'next/headers';
import ImportCard from '@/components/Card';

import { Metadata } from 'next';
export const metadata : Metadata = {
  title: "Nhập kho"
}
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


// Assuming you have a types file for your Import
type Import = {
  _id: string;
  deliverer: string;
  providerId: string;
  storageId: string;
  note: string;
};
export default async function ImportPage() {
  let imports: Import[] = [];
  let error: string | null = null;

  try {
    // Fetch data from your Express API
    // Ensure process.env.NEXT_PUBLIC_API_ENDPOINT is correctly set in your .env file
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const response = await fetch(`${RENDER_BACKEND_URL}/api/imports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // If the response is not OK, throw an error to be caught by the catch block
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch imports data');
    }

    // const data = await response.json();
    // imports = data.imports; // Assuming your API returns { imports: [...] }
    imports = await response.json();
  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu nhập kho. Vui lòng thử lại sau.";
  }

  // Define a type for the column structure
  type Column = {
    key: keyof Import | 'actions'; // 'actions' for potential future action buttons
    label: string;
  };

  // Define column headers based on Import properties
  // You can manually define the order and display names
  const columns: Column[] = [
    { key: '_id', label: 'ID Phiếu nhập' },
    { key: 'deliverer', label: 'Người giao hàng' },
    { key: 'providerId', label: 'Mã nhà cung cấp' },
    { key: 'storageId', label: 'Mã kho' },
    { key: 'note', label: 'Ghi chú' },
    { key: 'actions', label: 'Hành động'},
  ];
  const cardDisplayFields = columns
    .filter(col => col.key !== 'actions')
    .map(col => ({ key: col.key as string, label: col.label }));

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý nhập kho</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <ImportAddWrapper />

      {!imports || imports.length === 0 ? (
        <p className="text-center text-gray-600">Không có dữ liệu nhập kho nào.</p>
      ) : (<>
        <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {imports.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((col) => (
                    <td
                      key={`${user._id}-${col.key}`}
                      className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200"
                    >
                      {/* Special handling for date fields if needed */}
                      {col.key === 'actions' ? (<ImportActions importOrder={user}/>) :
                      (['createdAt', 'updatedAt'].includes(col.key)
                        ? new Date(user[col.key as keyof Import] as string).toLocaleDateString('vi-VN') // Assert keyof Import and string for date
                        : user[col.key as keyof Import])} {/* Safely access property using keyof Import */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden grid grid-cols-1 gap-4">
            {imports.map((importOrder) => (
              <ImportCard
                key={importOrder._id}
                data={importOrder}
                displayFields={cardDisplayFields} // Pass the filtered columns for display
              >
                {/* Pass the ImportActions component as children to the Card */}
                <ImportActions importOrder={importOrder} />
              </ImportCard>
            ))}
          </div>
          </>
      )}
    </div>
  );
}
