'use client';

import React, { useActionState, useState, useEffect } from 'react';
import { Trash2, Edit, Save, XCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast
import { deleteUser, updateUser } from '@/actions/user-actions'; // Import both server actions

type User = {
  _id: string;
  username: string;
  name: string;
  role: 'admin' | 'customer' | 'staff'; // Adjust roles as per your schema
  createdAt: string;
  updatedAt: string;
  // Add other properties as they exist in your User model
};
// Define props for UserActions component
interface UserActionsProps {
  user: User;
}

export default function UserActions({ user }: UserActionsProps) {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // State for the delete action
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteUser, {
    error: "",
    success: false,
  });

  // State for the update action
  const [updateState, updateAction, isUpdating] = useActionState(updateUser, {
    error: "",
    success: false,
  });

  // Effect to handle update success/error and show toasts
  useEffect(() => {
    // This effect should run when the update action completes (isUpdating becomes false)
    // and then check the state for success or error.
    if (!isUpdating) { // Only react when the action has finished
      if (updateState.success) {
        toast.success('Cập nhật tài khoản thành công!');
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
        <p className="mb-6">Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Hủy
          </button>
          <form action={deleteAction}>
            <input type="hidden" name="userId" value={user._id} />
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
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa tài khoản</h3>
        <form action={updateAction}>
          <input type="hidden" name="userId" value={user._id} />

          <div className="mb-4">
            <label htmlFor="edit-username" className="block text-gray-700 text-sm font-bold mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="edit-username"
              name="username"
              defaultValue={user.username}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-gray-700 text-sm font-bold mb-2">
              Tên:
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              defaultValue={user.name}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="edit-role" className="block text-gray-700 text-sm font-bold mb-2">
              Vai trò:
            </label>
            <select
              id="edit-role"
              name="role"
              defaultValue={user.role}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
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
