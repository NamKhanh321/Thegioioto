"use server";

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Define the type for the state that the server action returns (optional for delete, but good practice)
type DeleteFormState = {
  error?: string,
  success?: boolean,
};

export async function deleteProductType(previousState: DeleteFormState, formData: FormData): Promise<DeleteFormState> {
  const productTypeId = formData.get('productTypeId') as string;

  if (!productTypeId) {
    return { error: 'Phải có mã loại sản phẩm!' };
  }

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies

    const response = await fetch(`${RENDER_BACKEND_URL}/api/productType/${productTypeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể xóa loại sản phẩm');
    }

    revalidatePath('/dashboard/productType');
    return { success: true, error: undefined };

  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message , success: false};
    return {error: 'Đã xảy ra lỗi khi xóa loại sản phẩm.', success: false};
  }
}

type UpdateFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProductType(previousState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const productTypeId = formData.get('productTypeId') as string;
  const productTypeName = formData.get('productTypeName') as string;

  if (!productTypeId) {
    return { error: 'Phải có id loại sản phẩm' };
  }

  if (!productTypeName || productTypeName.trim() === '') {
    return { error: 'Tên loại sản phẩm không được để trống.' };
  }

  const payload = {
    productTypeName: productTypeName.trim(),
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/productType/${productTypeId}`, {
      method: 'PATCH', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể cập nhật loại sản phẩm');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/productType');

    return { success: true }; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false};
    return {error: 'Đã xảy ra lỗi khi cập nhật loại sản phẩm.' , success: false};
  }
}

type CreateFormState = {
  error?: string | null;
  success?: boolean | null;
  productTypeName?: string | null;
};
export async function createProductType(previousState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const productTypeName = formData.get('productTypeName') as string;
  // Note: Password update should ideally be a separate action for security
  // or handled very carefully here (e.g., only if password field is explicitly provided and hashed)

  // Basic validation (enhance as needed)
  if (!productTypeName || productTypeName.trim() === '') {
    return { error: 'Tên sản phẩm không được để trống.'};
  }

  const payload = {
    productTypeName: productTypeName.trim(),
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/productType`, {
      method: 'POST', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Có lỗi xảy ra! Không thể tạo loại sản phẩm');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/productType');

    return { success: true}; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false, productTypeName};
    return {error: 'Đã xảy ra lỗi khi tạo loại sản phẩm.', success: false, productTypeName};
  }
}