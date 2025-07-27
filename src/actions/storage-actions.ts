"use server";

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Define the type for the state that the server action returns (optional for delete, but good practice)
type DeleteFormState = {
  error?: string,
  success?: boolean,
};

export async function deleteStorage(previousState: DeleteFormState, formData: FormData): Promise<DeleteFormState> {
  const storageId = formData.get('storageId') as string;

  if (!storageId) {
    return { error: 'Phải có mã kho!' };
  }

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies

    const response = await fetch(`${RENDER_BACKEND_URL}/api/storages/${storageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể xóa kho');
    }

    revalidatePath('/dashboard/storage');
    return { success: true, error: undefined };

  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message , success: false};
    return {error: 'Đã xảy ra lỗi khi xóa kho.', success: false};
  }
}

type UpdateFormState = {
  error?: string;
  success?: boolean;
};

export async function updateStorage(previousState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const storageId = formData.get('storageId') as string;
  const storageName = formData.get('storageName') as string;

  if (!storageId) {
    return { error: 'Phải có id kho' };
  }

  if (!storageName || storageName.trim() === '') {
    return { error: 'Tên kho không được để trống.' };
  }

  const payload = {
    storageName: storageName.trim(),
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/storages/${storageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể cập nhật kho');
    }

    revalidatePath('/dashboard/storage');

    return { success: true };
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false};
    return {error: 'Đã xảy ra lỗi khi cập nhật kho.' , success: false};
  }
}

type CreateFormState = {
  error?: string | null;
  success?: boolean | null;
  storageName?: string | null;
};
export async function createStorage(previousState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const storageName = formData.get('storageName') as string;

  if (!storageName || storageName.trim() === '') {
    return { error: 'Tên kho không được để trống.'};
  }

  const payload = {
    storageName: storageName.trim(),
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/storages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Có lỗi xảy ra! Không thể tạo kho');
    }

    revalidatePath('/dashboard/storage');

    return { success: true};
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false, storageName};
    return {error: 'Đã xảy ra lỗi khi tạo kho.', success: false, storageName};
  }
}