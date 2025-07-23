"use server";

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Define the type for the state that the server action returns (optional for delete, but good practice)
type DeleteFormState = {
  error?: string,
  success?: boolean,
};

export async function deleteProvider(previousState: DeleteFormState, formData: FormData): Promise<DeleteFormState> {
  const providerId = formData.get('providerId') as string;

  if (!providerId) {
    return { error: 'Phải có mã nhà cung cấp!' };
  }

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies

    const response = await fetch(`${RENDER_BACKEND_URL}/api/providers/${providerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể xóa nhà cung cấp');
    }

    revalidatePath('/dashboard/providers');
    return { success: true, error: undefined };

  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message , success: false};
    return {error: 'Đã xảy ra lỗi khi xóa nhà cung cấp.', success: false};
  }
}

type UpdateFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProvider(previousState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const providerId = formData.get('providerId') as string;
  const providerName = formData.get('providerName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  if (!providerId) {
    return { error: 'Phải có id nhà cung cấp' };
  }

  if (!providerName || providerName.trim() === '') {
    return { error: 'Tên nhà cung cấp không được để trống.' };
  }

  const payload = {
    providerName: providerName.trim(),
    phone: phone,
    address: address,
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/providers/${providerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể cập nhật nhà cung cấp');
    }

    revalidatePath('/dashboard/providers');

    return { success: true };
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false};
    return {error: 'Đã xảy ra lỗi khi cập nhật nhà cung cấp.' , success: false};
  }
}

type CreateFormState = {
  error?: string | null;
  success?: boolean | null;
  providerName?: string | null;
  phone?: string | null;
  address?: string | null;
};
export async function createProvider(previousState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const providerName = formData.get('providerName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  if (!providerName || providerName.trim() === '') {
    return { error: 'Tên nhà cung cấp không được để trống.', phone, address };
  }

  const payload = {
    providerName: providerName.trim(),
    phone: phone,
    address: address,
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/providers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Có lỗi xảy ra! Không thể tạo nhà cung cấp');
    }

    revalidatePath('/dashboard/providers');

    return { success: true};
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false, providerName, phone, address};
    return {error: 'Đã xảy ra lỗi khi tạo nhà cung cấp.', success: false, providerName, phone, address};
  }
}