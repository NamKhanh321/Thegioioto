// This component is a Server Component by default in Next.js App Router
// No 'use client' directive means it runs on the server.

import React from 'react';
import ProductActionsWrapper from './components/updateAndDelete-wrapper';
import ProductCard from '@/components/Card';
import ProductAddWrapper from './components/add-btn-wrapper';
import { cookies } from 'next/headers';

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sản phẩm"
}
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;


// Assuming you have a types file for your User
type Product = {
  _id: string;
  productName: string;
  productDetail: string;
  providerId: string;
  price: string;
  image: string;
  productTypeId: string;
};
export default async function ProductTypePage() {
  let product : Product[] = [];
  let error: string | null = null;

  try {
    // Fetch data from your Express API
    // Ensure process.env.NEXT_PUBLIC_API_ENDPOINT is correctly set in your .env file
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const response = await fetch(`${RENDER_BACKEND_URL}/api/products`, {
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
      throw new Error(errorData.message || 'Không thể lấy dữ liệu loại sản phẩm');
    }

    // const data = await response.json();
    // users = data.users; // Assuming your API returns { users: [...] }
    product = await response.json();
  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.";
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
    { key: '_id', label: 'Id sản phẩm' },
    { key: 'productName', label: 'Tên sản phẩm' },
    { key: 'productDetail', label: 'Thông số sản phẩm' },
    { key: 'price', label: 'Giá'}
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý sản phẩm</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <ProductAddWrapper />

      {!product || product.length === 0 ? (
        <p className="text-center text-gray-600">Không có dữ liệu loại sản phẩm nào.</p>
      ) : (
        <div className="flex flex-wrap rounded-lg shadow-md">
            {product.map((data) => (<ProductCard title={data.productName} key={data._id} data={data} displayFields={productDisplayFields}><ProductActionsWrapper product={data}/></ProductCard>))}
        </div>
      )}
    </div>
  );
}
