'use client';

import React, { useActionState, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PackagePlus , XCircle, Save } from 'lucide-react'; // Icons for create, cancel, save
import { createProduct } from '@/actions/product-actions'; // Import the createUser server action

// Define the initial state for the form
const initialState = {
  error: "",
  success: false,
  productName: "",
  productDetail: "",
  productTypeId: "",
  price: "",
  image: "",
  providerId: "",
};

interface ProductType {
  _id: string;
  productTypeName: string;
}

interface Provider {
  _id: string;
  providerName: string;
}

interface CreateProductButtonProps {
  productTypes?: ProductType[]; // Optional array of ProductType objects
  providers?: Provider[];     // Optional array of Provider objects
}

export default function CreateProductButton({ productTypes = [], providers = [] } : CreateProductButtonProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [state, action, isCreating] = useActionState(createProduct, initialState);

  useEffect(() => {
    if (!isCreating) {
      if (state.success) {
        toast.success('Tạo sản phẩm mới thành công!');
        setShowCreateModal(false);
      } else if (state.error) {
        toast.error(`Lỗi tạo sản phẩm: ${state.error}`);
      }
    }
  }, [state, isCreating]);

  const CreateUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Tạo sản phẩm mới</h3>
        <form action={action}>
          <div className="mb-4">
            <label htmlFor="create-productName" className="block text-gray-700 text-sm font-bold mb-2">
              Tên sản phẩm:
            </label>
            <input
              type="text"
              id="create-productName"
              name="productName"
              defaultValue={state.productName || ''} // Pre-fill if error occurred
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="create-productTypeId" className="block text-gray-700 text-sm font-bold mb-2">
              Loại sản phẩm:
            </label>
            <select
              id="create-productTypeId"
              name="productTypeId"
              defaultValue={state.productTypeId || ''}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Chọn loại sản phẩm</option> {/* Default empty option */}
              {productTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.productTypeName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="create-providerId" className="block text-gray-700 text-sm font-bold mb-2">
              Nhà cung cấp:
            </label>
            <select
              id="create-providerId"
              name="providerId"
              defaultValue={state.providerId || ''}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Chọn nhà cung cấp</option> {/* Default empty option */}
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.providerName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="create-productDetail" className="block text-gray-700 text-sm font-bold mb-2">
              Thông số sản phẩm:
            </label>
            <input
              type="text"
              id="create-productDetail"
              name="productDetail"
              defaultValue={state.productDetail || ''} // Pre-fill if error occurred
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="create-image" className="block text-gray-700 text-sm font-bold mb-2">
              Ảnh:
            </label>
            <input
              type="text"
              id="create-image"
              name="image"
              defaultValue={state.image || ''} // Pre-fill if error occurred
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="create-price" className="block text-gray-700 text-sm font-bold mb-2">
              Giá:
            </label>
            <input
              type="text"
              id="create-price"
              name="price"
              defaultValue={state.price || ''} // Pre-fill if error occurred
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
  // --- End Create User Modal ---

  return (
    <>
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
      >
        <PackagePlus size={20} /> Tạo sản phẩm mới
      </button>

      {showCreateModal && <CreateUserModal />}
    </>
  );
}
