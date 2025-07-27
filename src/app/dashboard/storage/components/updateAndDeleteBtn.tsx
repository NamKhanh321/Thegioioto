'use client';

import React, { useActionState, useState, useEffect } from 'react';
import { Trash2, Edit, Search, Save, XCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast
import { deleteStorage, updateStorage } from '@/actions/storage-actions'; // Import both server actions

type Storage = {
  _id: string;
  storageName: string;
};
type StorageDetail = {
  productName: string;
  amount: string;
};
// Define props for StorageActions component
interface StorageActionsProps {
  storage: Storage;
  storageDetails: StorageDetail[];
}

export default function StorageActions({ storage, storageDetails }: StorageActionsProps) {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State for the delete action
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteStorage, {
    error: "",
    success: false,
  });

  // State for the update action
  const [updateState, updateAction, isUpdating] = useActionState(updateStorage, {
    error: "",
    success: false,
  });

  // Effect to handle update success/error and show toasts
  useEffect(() => {
    if (!isUpdating) {
      if (updateState.success) {
        toast.success('Cập nhật kho thành công!');
        setShowEditModal(false);
      } else if (updateState.error) {
        toast.error(`Lỗi cập nhật: ${updateState.error}`);
      }
    }
  }, [updateState, isUpdating]);

  useEffect(() => {
    if (!isDeleting) {
      if (deleteState.success) {
        setShowDeleteConfirmModal(false);
      }
      else if (deleteState.error) {
        toast.error(`Lỗi xóa: ${deleteState.error}`);
        setShowDeleteConfirmModal(false);
      }
    }
  }, [deleteState, isDeleting]);

  // --- Delete Confirmation Modal ---
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
        <p className="mb-6">Bạn có chắc chắn muốn xóa kho này không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Hủy
          </button>
          <form action={deleteAction}>
            <input type="hidden" name="storageId" value={storage._id} />
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

  // --- Edit Storage Modal ---
  const EditStorageModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa kho</h3>
        <form action={updateAction}>
          <input type="hidden" name="storageId" value={storage._id} />

          <div className="mb-4">
            <label htmlFor="edit-storageName" className="block text-gray-700 text-sm font-bold mb-2">
              Tên kho:
            </label>
            <input
              type="text"
              id="edit-storageName"
              name="storageName"
              defaultValue={storage.storageName}
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
  // --- End Edit Storage Modal ---

  // --- Show Detail Storage Modal ---
 const DetailModal = () => {
    // Filter storageDetails to include only items with amount > 0
    const filteredStorageDetails = storageDetails.filter(detail => parseInt(detail.amount) > 0);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Chi tiết kho: <span className="text-blue-600">{storage.storageName}</span>
          </h3>

          {/* Conditional rendering for filtered details or empty state */}
          {filteredStorageDetails && filteredStorageDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-tl-lg">
                      Tên sản phẩm
                    </th>
                    <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-tr-lg">
                      Số lượng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStorageDetails.map((detail, index) => (
                    <tr key={detail.productName} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150`}>
                      <td className="py-3 px-4 text-gray-800 border-b border-gray-200">{detail.productName}</td>
                      <td className="py-3 px-4 text-gray-800 border-b border-gray-200">{detail.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">
                <Search size={24} className="inline-block mr-2 text-gray-500" />
                Không có sản phẩm nào có số lượng lớn hơn 0 trong kho này.
              </p>
              <p className="text-gray-500 text-sm mt-2">Tất cả sản phẩm hiện tại đều đã hết hoặc chưa được nhập.</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 shadow-md"
            >
              <XCircle size={20} /> Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

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

      {/* Show Detail Button */}
      <button
        onClick={() => setShowDetailModal(true)}
        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center gap-1"
      >
        <Search size={16} /> Xem chi tiết
      </button>

      {showDeleteConfirmModal && <DeleteConfirmModal />}
      {showEditModal && <EditStorageModal />}
      {showDetailModal && <DetailModal />}
    </div>
  );
}
