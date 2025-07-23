"use server";

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Define the type for the state that the server action returns (optional for delete, but good practice)
type DeleteFormState = {
  error?: string,
  success?: boolean,
};

export async function deleteProduct(previousState: DeleteFormState, formData: FormData): Promise<DeleteFormState> {
  const productId = formData.get('productId') as string;

  if (!productId) {
    return { error: 'Phải có mã sản phẩm!' };
  }

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies

    const response = await fetch(`${RENDER_BACKEND_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể xóa sản phẩm');
    }

    revalidatePath('/dashboard/product');
    return { success: true, error: undefined };

  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message , success: false};
    return {error: 'Đã xảy ra lỗi khi xóa sản phẩm.', success: false};
  }
}

type UpdateFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProduct(previousState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const productId = formData.get('productId') as string;
  const productName = formData.get('productName') as string;
  const productDetail = formData.get('productDetail') as string;
  const productTypeId = formData.get('productTypeId') as string;
  const price = formData.get('price') as string;
  const image = formData.get('image') as string;
  const providerId = formData.get('providerId') as string;

  if (!productId) {
    return { error: 'Phải có id sản phẩm' };
  }

  if (!productName || productName.trim() === '') {
    return { error: 'Tên sản phẩm không được để trống.' };
  }

  const payload = {
    productName: productName.trim(),
    productDetail: productDetail,
    productTypeId: productTypeId,
    price: Number(price),
    image: image,
    providerId: providerId,
    // Add other fields you want to update
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/products/${productId}`, {
      method: 'PATCH', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể cập nhật sản phẩm');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/product');

    return { success: true }; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false};
    return {error: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' , success: false};
  }
}

type CreateFormState = {
  error?: string | null;
  success?: boolean | null;
  productName?: string | null;
  productDetail?: string | null;
  productTypeId?: string | null;
  price?: string | null;
  image?: string | null;
  providerId?: string | null;
};
export async function createProduct(previousState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const productName = formData.get('productName') as string;
  const productDetail = formData.get('productDetail') as string;
  const productTypeId = formData.get('productTypeId') as string;
  const price = formData.get('price') as string;
  const image = formData.get('image') as string;
  const providerId = formData.get('providerId') as string;
  // Note: Password update should ideally be a separate action for security
  // or handled very carefully here (e.g., only if password field is explicitly provided and hashed)

  // Basic validation (enhance as needed)
  if (!productName || productName.trim() === '') {
    return { error: 'Tên sản phẩm không được để trống.', productDetail, productTypeId, price, image, providerId };
  }

  const payload = {
    productName: productName.trim(),
    productDetail: productDetail,
    productTypeId: productTypeId,
    price: Number(price),
    image: image,
    providerId: providerId,
    // Add other fields you want to update
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/products`, {
      method: 'POST', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Có lỗi xảy ra! Không thể tạo sản phẩm');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/product');

    return { success: true}; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false, productName, productDetail, productTypeId, price, image, providerId};
    return {error: 'Đã xảy ra lỗi khi tạo sản phẩm.', success: false, productName, productDetail, productTypeId, price, image, providerId};
  }
}