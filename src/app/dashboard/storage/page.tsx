// This component is a Server Component by default in Next.js App Router
// No 'use client' directive means it runs on the server.

import React from 'react';
import StorageActionsWrapper from './components/storageActionWrapper';
import StorageCard from '@/components/Card';
import CreateStorageButton from './components/add-btn';
import { cookies } from 'next/headers';
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Quản lý kho"
}

// Assuming you have a types file for your User
type Storage = {
  _id: string;
  storageName: string;
};
export default async function StoragePage() {
  let storage : Storage[] = [];
  let error: string | null = null;

  try {
    // Fetch data from your Express API
    // Ensure process.env.NEXT_PUBLIC_API_ENDPOINT is correctly set in your .env file
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const response = await fetch(`${RENDER_BACKEND_URL}/api/storages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      // cache: 'no-store',
    });


    if (!response.ok) {
      // If the response is not OK, throw an error to be caught by the catch block
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể lấy dữ liệu nhà cung cấp');
    }

    // const data = await response.json();
    // users = data.users; // Assuming your API returns { users: [...] }
    storage = await response.json();
  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu nhà cung cấp. Vui lòng thử lại sau.";
  }

  const storageDisplayFields = [
    { key: '_id', label: 'Id kho' },
    { key: 'storageName', label: 'Tên kho' },
  ]
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý kho</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <CreateStorageButton />

      {!storage || storage.length === 0 ? (
        <p className="text-center text-gray-600">Không có dữ liệu kho nào.</p>
      ) : (
        <div className="flex flex-wrap rounded-lg shadow-md">
            {storage.map((data) => (<StorageCard title={data.storageName} key={data._id} data={data} displayFields={storageDisplayFields}><StorageActionsWrapper storage={data}/></StorageCard>))}
        </div>
      )}
    </div>
  );
}
