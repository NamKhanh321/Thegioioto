'use client';

import React, { useActionState, useState, useEffect } from 'react';
import { Trash2, Edit, Save, XCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast
import { deleteProduct, updateProduct } from '@/actions/product-actions'; // Import both server actions

type Product = {
  _id: string;
  productName: string;
  productDetail: string;
  providerId: string;
  price: string;
  image: string;
  productTypeId: string;
};
// Define props for UserActions component
interface ProductType {
  _id: string;
  productTypeName: string;
}

interface Provider {
  _id: string;
  providerName: string;
}

interface ProductActionsProps {
  product: Product;
  productTypes?: ProductType[];
  providers?: Provider[];
}

export default function ProductActions({ product, productTypes = [], providers = [] } : ProductActionsProps) {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // State for the delete action
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteProduct, {
    error: "",
    success: false,
  });

  // State for the update action
  const [updateState, updateAction, isUpdating] = useActionState(updateProduct, {
    error: "",
    success: false,
  });

  // Effect to handle update success/error and show toasts
  useEffect(() => {
    // This effect should run when the update action completes (isUpdating becomes false)
    // and then check the state for success or error.
    if (!isUpdating) { // Only react when the action has finished
      if (updateState.success) {
        toast.success('Cập nhật sản phẩm thành công!');
        setShowEditModal(false); // Close modal on success
      } else if (updateState.error) { // Use else if to prioritize success over error
        toast.error(`Lỗi cập nhật: ${updateState.error}`);
      }
    }
  }, [updateState, isUpdating]); // Depend on the entire updateState object and its pending status

  // Effect to handle delete error (success is handled by revalidatePath)
  useEffect(() => {
    // This effect should run when the delete action completes (isDeleting becomes false)
    if (!isDeleting) { // Only react when the action has finished
      if (deleteState.success) {
        // toast.success('Xóa tài khoản thành công!');
        setShowDeleteConfirmModal(false); // Close modal even on error for delete
      }
      else if (deleteState.error) {
        toast.error(`Lỗi xóa: ${deleteState.error}`);
        setShowDeleteConfirmModal(false); // Close modal even on error for delete
      }
    }
  }, [deleteState, isDeleting]); // Depend on the entire deleteState object and its pending status

  // --- Delete Confirmation Modal ---
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
        <p className="mb-6">Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Hủy
          </button>
          <form action={deleteAction}>
            <input type="hidden" name="productId" value={product._id} />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 size={16} /> Xóa
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  // --- End Delete Confirmation Modal ---

  // --- Edit User Modal ---
  const EditUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa sản phẩm</h3>
        <form action={updateAction}>
          <input type="hidden" name="productId" value={product._id} />

          <div className="mb-4">
            <label htmlFor="create-productName" className="block text-gray-700 text-sm font-bold mb-2">
              Tên sản phẩm:
            </label>
            <input
              type="text"
              id="create-productName"
              name="productName"
              defaultValue={product.productName || ''} // Pre-fill if error occurred
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
              defaultValue={product.productTypeId || ''}
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
              defaultValue={product.providerId || ''}
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
              defaultValue={product.productDetail || ''} // Pre-fill if error occurred
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
              defaultValue={product.image || ''} // Pre-fill if error occurred
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
              defaultValue={product.price || ''} // Pre-fill if error occurred
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <XCircle size={16} className="inline-block mr-1" /> Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={16} /> Lưu
                </>
              )}
            </button>
            </div>
          </form>
        </div>
      </div>
  );
  // --- End Edit User Modal ---

  return (
    <div className="flex gap-2">
      {/* Edit Button */}
      <button
        onClick={() => setShowEditModal(true)}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
      >
        <Edit size={16} /> Sửa
      </button>

      {/* Delete Button */}
      <button
        onClick={() => setShowDeleteConfirmModal(true)}
        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-1"
      >
        <Trash2 size={16} /> Xóa
      </button>

      {showDeleteConfirmModal && <DeleteConfirmModal />}
      {showEditModal && <EditUserModal />}
    </div>
  );
}
