// This component is a Server Component by default in Next.js App Router
// No 'use client' directive means it runs on the server.

import React from 'react';
import UserActions from '@/app/dashboard/account/components/user-actions';
import CreateUserButton from './components/add-btn';
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


// Assuming you have a types file for your User
type User = {
  _id: string;
  username: string;
  name: string;
  role: 'admin' | 'customer' | 'staff'; // Adjust roles as per your schema
  createdAt: string;
  updatedAt: string;
  // Add other properties as they exist in your User model
};
export default async function AccountPage() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    // Fetch data from your Express API
    // Ensure process.env.NEXT_PUBLIC_API_ENDPOINT is correctly set in your .env file
    const response = await fetch(`${RENDER_BACKEND_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });


    if (!response.ok) {
      // If the response is not OK, throw an error to be caught by the catch block
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users data');
    }

    // const data = await response.json();
    // users = data.users; // Assuming your API returns { users: [...] }
    users = await response.json();
  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.";
  }

  // Define a type for the column structure
  type Column = {
    key: keyof User | 'actions'; // 'actions' for potential future action buttons
    label: string;
  };

  // Define column headers based on User properties
  // You can manually define the order and display names
  const columns: Column[] = [
    { key: '_id', label: 'ID Người dùng' },
    { key: 'username', label: 'Tên đăng nhập' },
    { key: 'name', label: 'Tên' },
    { key: 'role', label: 'Vai trò' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'updatedAt', label: 'Cập nhật cuối' },
    { key: 'actions', label: 'Hành động'}
    // Add more columns as needed
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý tài khoản</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <CreateUserButton />

      {!users || users.length === 0 ? (
        <p className="text-center text-gray-600">Không có dữ liệu người dùng nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
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
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((col) => (
                    <td
                      key={`${user._id}-${col.key}`}
                      className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200"
                    >
                      {/* Special handling for date fields if needed */}
                      {col.key === 'actions' ? (<UserActions user={user}/>) :
                      (['createdAt', 'updatedAt'].includes(col.key)
                        ? new Date(user[col.key as keyof User] as string).toLocaleDateString('vi-VN') // Assert keyof User and string for date
                        : user[col.key as keyof User])} {/* Safely access property using keyof User */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
