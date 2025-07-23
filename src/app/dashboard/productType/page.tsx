// This component is a Server Component by default in Next.js App Router
// No 'use client' directive means it runs on the server.

import React from 'react';
import ProductTypeActions from './components/updateAndDeleteBtn';
import ProductCard from '@/components/Card';
import CreateProductTypeButton from './components/add-btn';
import { cookies } from 'next/headers';
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


// Assuming you have a types file for your User
type ProductType = {
  _id: string;
  productTypeName: string;
};
export default async function ProductTypePage() {
  let productType : ProductType[] = [];
  let error: string | null = null;

  try {
    // Fetch data from your Express API
    // Ensure process.env.NEXT_PUBLIC_API_ENDPOINT is correctly set in your .env file
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const response = await fetch(`${RENDER_BACKEND_URL}/api/productType`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      // cache: 'no-store',
    });


    if (!response.ok) {
      // If the response is not OK, throw an error to be caught by the catch block
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể lấy dữ liệu loại sản phẩm');
    }

    // const data = await response.json();
    // users = data.users; // Assuming your API returns { users: [...] }
    productType = await response.json();
  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu loại sản phẩm. Vui lòng thử lại sau.";
  }

  // Define a type for the column structure
  // type Column = {
  //   key: keyof ProductType | 'actions'; // 'actions' for potential future action buttons
  //   label: string;
  // };

  // Define column headers based on User properties
  // You can manually define the order and display names
  // const columns: Column[] = [
  //   { key: '_id', label: 'ID loại sản phẩm' },
  //   { key: 'productTypeName', label: 'Tên loại sản phẩm' },
  // ];
  const productDisplayFields = [
    { key: '_id', label: 'Id loại sản phẩm' },
    { key: 'productTypeName', label: 'Tên loại sản phẩm' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý loại sản phẩm</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <CreateProductTypeButton />

      {!productType || productType.length === 0 ? (
        <p className="text-center text-gray-600">Không có dữ liệu loại sản phẩm nào.</p>
      ) : (
        <div className="flex flex-wrap rounded-lg shadow-md">
            {productType.map((data) => (<ProductCard title={data.productTypeName} key={data._id} data={data} displayFields={productDisplayFields}><ProductTypeActions productType={data}/></ProductCard>))}
        </div>
      )}
    </div>
  );
}
