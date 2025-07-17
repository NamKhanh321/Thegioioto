import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }

  try {
    // 1. (Không bắt buộc) Thông báo cho express backend về sự kiện đăng xuất
    // Phía backend có thể đưa access_token đang dùng vào black list
    await fetch(`${RENDER_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
    });

    // 2.Xóa cookies 'access_token' khỏi browser người dùng
    const response = NextResponse.json({ message: 'Đăng xuất thành công' }, { status: 200 });
    response.cookies.delete('access_token');
    // NextResponse.cookies.delete('access_token');
    
    // Cách 2 để xóa cookies, có thể tùy chỉnh
    // response.cookies.set('access_token', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   path: '/',
    //   expires: new Date(0),
    //   sameSite: 'Lax',
    // });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error during logout.' }, { status: 500 });
  }
}
