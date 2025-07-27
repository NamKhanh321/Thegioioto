'use client';

import React, { useActionState, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Import, XCircle, Save, PlusCircle, MinusCircle } from 'lucide-react';
import { startTransition } from 'react';

import { createImport } from '@/actions/import-actions';

const initialState = {
    error: "",
    success: false,
    deliverer: "",
    providerId: "",
    storageId: "",
    note: "",
    importDetails: [],
};

type Storage = {
    _id: string;
    storageName: string;
}

type Provider = {
    _id: string;
    providerName: string;
}

type Product = {
    _id: string;
    productName: string;
}

type ImportDetailInput = {
    id: number;
    productId: string;
    amount: number | '';
}

type CreateImportProps = {
    storages: Storage[];
    providers: Provider[];
    products: Product[];
}

export default function CreateImportButton({ storages = [], providers = [], products = [] }: CreateImportProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [importDetails, setImportDetails] = useState<ImportDetailInput[]>([]);
    const nextDetailId = useRef(0);

    const [state, formAction, isCreating] = useActionState(createImport, initialState);

    useEffect(() => {
        if (!isCreating) {
            if (state.success) {
                toast.success('Tạo phiếu nhập mới thành công!');
                setShowCreateModal(false);
                setImportDetails([]);
                nextDetailId.current = 0;
            } else if (state.error) {
                toast.error(`Lỗi tạo phiếu nhập: ${state.error}`);
            }
        }
    }, [state, isCreating]);

    const addImportDetailRow = () => {
        setImportDetails(prevDetails => [
            ...prevDetails,
            { id: nextDetailId.current++, productId: '', amount: '' }
        ]);
    };

    const removeImportDetailRow = (id: number) => {
        setImportDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
    };

    const handleDetailChange = (id: number, field: keyof ImportDetailInput, value: string | number) => {
        setImportDetails(prevDetails =>
            prevDetails.map(detail =>
                detail.id === id ? { ...detail, [field]: value } : detail
            )
        );
    };

    // This function remains crucial for filtering product options within each dropdown
    const getAvailableProducts = (currentDetailProductId: string) => {
        const selectedProductIds = new Set(
            importDetails
                .filter(detail => detail.productId !== '' && detail.productId !== currentDetailProductId)
                .map(detail => detail.productId)
        );
        return products.filter(product => !selectedProductIds.has(product._id));
    };

    // **CHANGED LOGIC HERE:**
    // Disable "Thêm sản phẩm" if the number of current detail rows is equal to or exceeds
    // the total number of unique products available.
    const canAddMoreRows = importDetails.length < products.length;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const cleanedImportDetails = importDetails
            .filter(detail => detail.productId !== '' && typeof detail.amount === 'number' && detail.amount > 0)
            .map(detail => ({
                productId: detail.productId,
                amount: detail.amount
            }));

        if (cleanedImportDetails.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sản phẩm hợp lệ vào chi tiết nhập kho.');
            return;
        }

        formData.append('importDetails', JSON.stringify(cleanedImportDetails));

        startTransition(() => formAction(formData));
    };


    // --- Create Import Modal ---
    const CreateImportModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Tạo phiếu nhập mới</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-md font-semibold mb-3">Thông tin phiếu nhập</h4>
                            <div className="mb-4">
                                <label htmlFor="create-deliverer" className="block text-gray-700 text-sm font-bold mb-2">
                                    Người giao hàng:
                                </label>
                                <input
                                    type="text"
                                    id="create-deliverer"
                                    name="deliverer"
                                    defaultValue={state.deliverer || ''}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="create-storageId" className="block text-gray-700 text-sm font-bold mb-2">
                                    Kho:
                                </label>
                                <select
                                    id="create-storageId"
                                    name="storageId"
                                    defaultValue={state.storageId || ''}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="">Chọn Kho</option>
                                    {storages.map((storage) => (
                                        <option key={storage._id} value={storage._id}>
                                            {storage.storageName}
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
                                    <option value="">Chọn nhà cung cấp</option>
                                    {providers.map((provider) => (
                                        <option key={provider._id} value={provider._id}>
                                            {provider.providerName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="create-note" className="block text-gray-700 text-sm font-bold mb-2">
                                    Ghi chú:
                                </label>
                                <input
                                    type="text"
                                    id="create-note"
                                    name="note"
                                    defaultValue={state.note || ''}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-semibold mb-3">Chi tiết nhập kho</h4>
                            <div className="max-h-80 overflow-y-auto pr-2">
                                {importDetails.length === 0 && (
                                    <p className="text-gray-500 mb-2">Chưa có sản phẩm nào được thêm.</p>
                                )}
                                {importDetails.map((detail) => (
                                    <div key={detail.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border rounded-md bg-gray-50 items-end">
                                        <div className="md:col-span-2">
                                            <label htmlFor={`product-${detail.id}`} className="block text-gray-700 text-sm font-bold mb-1">
                                                Sản phẩm:
                                            </label>
                                            <select
                                                id={`product-${detail.id}`}
                                                value={detail.productId}
                                                onChange={(e) => handleDetailChange(detail.id, 'productId', e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                required
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {getAvailableProducts(detail.productId).map(product => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.productName}
                                                    </option>
                                                ))}
                                                {detail.productId && !getAvailableProducts(detail.productId).find(p => p._id === detail.productId) && (
                                                    <option value={detail.productId}>
                                                        {products.find(p => p._id === detail.productId)?.productName || 'Sản phẩm đã chọn'}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor={`amount-${detail.id}`} className="block text-gray-700 text-sm font-bold mb-1">
                                                Số lượng:
                                            </label>
                                            <input
                                                type="number"
                                                id={`amount-${detail.id}`}
                                                value={detail.amount}
                                                onChange={(e) => handleDetailChange(detail.id, 'amount', parseInt(e.target.value) || '')}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeImportDetailRow(detail.id)}
                                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                                                aria-label="Remove product"
                                            >
                                                <MinusCircle size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addImportDetailRow}
                                className={`mt-3 px-4 py-2 text-white rounded-md transition-colors duration-200 flex items-center gap-2 ${canAddMoreRows ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!canAddMoreRows} // <-- Uses the new canAddMoreRows variable
                            >
                                <PlusCircle size={20} /> Thêm sản phẩm
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
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
                <Import size={20} /> Tạo phiếu nhập kho mới
            </button>

            {showCreateModal && <CreateImportModal />}
        </>
    );
}