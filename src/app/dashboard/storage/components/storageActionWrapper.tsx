// components/StorageAddWrapper.jsx
import React from 'react';
import StorageActions from './updateAndDeleteBtn'; // Adjust path as necessary
import { cookies } from 'next/headers';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

type Storage = {
  _id: string;
  storageName: string;
};

interface StorageActionsWrapperProps {
  storage: Storage; // This wrapper now expects a single storage to operate on
}
// This is a Server Component, so it can fetch data securely on the server.
export default async function StorageActionsWrapper({ storage }: StorageActionsWrapperProps) {
  let storageDetails = [];
  let error = null;

  try {
    const id = storage._id;
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies
    const storagesRes = await fetch(`${RENDER_BACKEND_URL}/api/storages/${id}`, {
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
    storageDetails = (await storagesRes.json()).details;

  } catch (err: unknown) {
    if(err instanceof Error)
      error = err.message;
    else
      error = "Không thể tải dữ liệu chi tiết kho. Vui lòng thử lại sau.";
  }

  // If there's an error fetching data, you might want to pass an empty array
  // or a specific error state to the client component, or render a fallback UI.
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        <p>Error loading storage creation form: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    // Pass the fetched data as props to the client component
    <StorageActions storage={storage} storageDetails={storageDetails}/>
  );
}
