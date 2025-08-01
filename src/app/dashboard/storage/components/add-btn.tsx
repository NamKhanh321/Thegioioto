'use client';

import React, { useActionState, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Store, XCircle, Save } from 'lucide-react'; // Icons for create, cancel, save
import { createStorage } from '@/actions/storage-actions'; // Import the createStorage server action

// Define the initial state for the form
const initialState = {
  error: "",
  success: false,
  storageName: "",
};

export default function CreateStorageButton() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [state, action, isCreating] = useActionState(createStorage, initialState);
  
  useEffect(() => {
    if (!isCreating) { // Only react when the action has finished
      if (state.success) {
        toast.success('Tạo kho mới thành công!');
        setShowCreateModal(false); // Close modal on success
      } else if (state.error) {
        toast.error(`Lỗi tạo kho: ${state.error}`);
      }
    }
  }, [state, isCreating]); // Depend on the entire state object and its pending status

  const CreateStorageModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Tạo kho mới</h3>
        <form action={action}>
          <div className="mb-4">
            <label htmlFor="create-storageName" className="block text-gray-700 text-sm font-bold mb-2">
              Tên kho:
            </label>
            <input
              type="text"
              id="create-storageName"
              name="storageName"
              defaultValue={state.storageName || ''}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <XCircle size={16} className="inline-block mr-1" /> Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={16} /> Tạo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
      >
        <Store size={20} /> Tạo kho mới
      </button>

      {showCreateModal && <CreateStorageModal />}
    </>
  );
}
