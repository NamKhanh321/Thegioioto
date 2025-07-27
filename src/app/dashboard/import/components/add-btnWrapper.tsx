// components/ImportAddWrapper.jsx
import React from 'react';
import CreateImportButton from './add-btn'; // Adjust path as necessary
import { cookies } from 'next/headers';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// This is a Server Component, so it can fetch data securely on the server.
export default async function ImportAddWrapper() {
  let storages = [];
  let providers = [];
  let products = [];
  let error = null;

  try {
    // Fetch storages
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const storagesRes = await fetch(`${RENDER_BACKEND_URL}/api/storages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store' // Ensure data is fresh
    });

    if (!storagesRes.ok) {
      const errorData = await storagesRes.json();
      throw new Error(errorData.msg || 'Không thể lấy dữ liệu kho');
    }
    storages = await storagesRes.json();

        // Fetch products
    const productsRes = await fetch(`${RENDER_BACKEND_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store' // Ensure data is fresh
    });

    if (!productsRes.ok) {
      const errorData = await productsRes.json();
      throw new Error(errorData.msg || 'Không thể lấy dữ liệu sản phẩm');
    }
    products = await productsRes.json();

    // Fetch providers
    const providersRes = await fetch(`${RENDER_BACKEND_URL}/api/providers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store' // Ensure data is fresh
    });

    if (!providersRes.ok) {
      const errorData = await providersRes.json();
      throw new Error(errorData.msg || 'Không thể lấy dữ liệu nhà cung cấp');
    }
    providers = await providersRes.json();

  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.";
  }

  // If there's an error fetching data, you might want to pass an empty array
  // or a specific error state to the client component, or render a fallback UI.
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        <p>Error loading product creation form: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    // Pass the fetched data as props to the client component
    <CreateImportButton storages={storages} providers={providers} products={products}/>
  );
}
