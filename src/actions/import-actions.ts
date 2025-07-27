"use server";

import { redirect } from "next/navigation";
type RegisterFormState = {
  error?: string | null;
  username: string | null;
  password: string | null;
  name: string | null;
};
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function registerImport(previousState: RegisterFormState, formData : FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const payload = {
        username: username,
        password: password,
        name: name,
        role: "customer",
    }
    const response = await fetch(`${RENDER_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    
    if(!response.ok)
    {
        const data = await response.json();
        return {
            error: data.msg,
            username,
            password, // You might want to clear this for security
            name,
        };
    }
    redirect('/login');
}

import { revalidatePath } from 'next/cache'; // To revalidate the data after deletion
import { cookies } from 'next/headers'; // To access cookies for authentication

// Define the type for the state that the server action returns (optional for delete, but good practice)
type DeleteFormState = {
  error?: string,
  success?: boolean,
};

export async function deleteImport(previousState: DeleteFormState, formData: FormData): Promise<DeleteFormState> {
  const userId = formData.get('userId') as string;

  if (!userId) {
    return { error: 'Import ID is missing for deletion.' };
  }

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value; // Get your auth token from cookies

    const response = await fetch(`${RENDER_BACKEND_URL}/api/imports/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể xóa người dùng');
    }

    // Revalidate the path to refresh the user list after successful deletion
    // This tells Next.js to refetch data for the /dashboard/import route on the next request
    revalidatePath('/dashboard/import');
    return { success: true, error: undefined }; // Return an empty object for success

  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message , success: false};
    return {error: 'Đã xảy ra lỗi khi xóa người dùng.', success: false};
  }
}

// Define the type for the state that the server action returns for update
type UpdateFormState = {
  error?: string;
  success?: boolean;
  // You might return the updated user data here if needed,
  // but revalidatePath will handle UI refresh.
};

export async function updateImport(previousState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  // Note: Password update should ideally be a separate action for security
  // or handled very carefully here (e.g., only if password field is explicitly provided and hashed)

  if (!userId) {
    return { error: 'Phải có id người dùng' };
  }

  // Basic validation (enhance as needed)
  if (!name || name.trim() === '') {
    return { error: 'Tên không được để trống.' };
  }
  const allowedRoles = ['admin', 'customer', 'staff']; // Match your Mongoose schema
  if (!role || !allowedRoles.includes(role)) {
    return { error: `Vai trò không hợp lệ. Chỉ chấp nhận: ${allowedRoles.join(', ')}.` };
  }

  const payload = {
    name: name.trim(),
    role: role,
    // Add other fields you want to update
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/imports/${userId}`, {
      method: 'PATCH', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Không thể cập nhật người dùng');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/import');

    return { success: true }; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false};
    return {error: 'Đã xảy ra lỗi khi cập nhật người dùng.' , success: false};
  }
}

type ImportDetail = {
  productId: string;
  amount: number;
}

type CreateFormState = {
  error?: string | null;
  success?: boolean | null;
  deliverer?: string | null;
  providerId?: string | null;
  storageId?: string | null;
  note?: string | null;
  importDetails?: ImportDetail[];
};
export async function createImport(previousState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const deliverer = formData.get('deliverer') as string;
  const providerId = formData.get('providerId') as string;
  const storageId = formData.get('storageId') as string;
  const note = formData.get('note') as string;
  const rawImportDetails = formData.get('importDetails');

  let parsedImportDetails;
  try {
    parsedImportDetails = rawImportDetails ? JSON.parse(rawImportDetails.toString()) : [];
    if(!Array.isArray(parsedImportDetails))
      parsedImportDetails = [];
  }
  catch (error){
    console.log(error);
    return {error: 'Dữ liệu chi tiết sản phẩm không hợp lệ', ...previousState};
  }

  // Basic validation (enhance as needed)
  if (!deliverer || deliverer.trim() === '') {
    return { error: 'Tên không được để trống.', providerId, storageId, note };
  }

  const payload = {
    deliverer: deliverer.trim(),
    providerId: providerId,
    storageId: storageId,
    note: note,
    importDetails: parsedImportDetails,
  };

  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('access_token')?.value;

    const response = await fetch(`${RENDER_BACKEND_URL}/api/imports`, {
      method: 'POST', // Or 'PUT' depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Có lỗi xảy ra! Không thể tạo phiếu nhập');
    }

    // Revalidate the path to refresh the user list after successful update
    revalidatePath('/dashboard/import');

    return { success: true}; // Indicate success
  } catch (error: unknown) {
    if(error instanceof Error)
      return { error: error.message, success: false, deliverer, providerId, storageId, note};
    return {error: 'Đã xảy ra lỗi khi tạo phiếu nhập.', success: false, deliverer, providerId, storageId, note};
  }
}