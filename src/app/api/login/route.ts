import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function POST(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }

  try {
    const body = await req.json();

    // 1. Gửi yêu cầu đăng nhập đến express backend
    const backendRes = await fetch(`${RENDER_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const backendData = await backendRes.json();

    if (backendRes.ok) {
      // 2. Lấy header 'Set-Cookie' từ phản hồi của backend
      const setCookieHeader = backendRes.headers.get('Set-Cookie');

      const response = NextResponse.json(backendData, { status: backendRes.status });

      if (setCookieHeader) {
        // Thuật toán trích xuất 1 cookies đơn giản, có thể cải tiến trong trường hợp xử lý nhiều cookies cùng lúc
        const cookieParts = setCookieHeader.split(';').map(s => s.trim());
        const [cookieNameValue] = cookieParts; // e.g., "access_token=someValue"
        const [cookieName, cookieValue] = cookieNameValue.split('=');

        // 3. Tạo cookie với tên miền của next.js app (thegioioto.vercel.app)
        response.cookies.set(cookieName, cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          // 'Lax' is generally safe for same-site (Vercel app domain)
          // 'None' is for cross-site, but here the cookie is set by the same domain as the app
          sameSite: 'lax',
          maxAge: 3600, // Tính theo giây
        });
      }

      return response;

    } else {
      // Trả về thông tin lỗi backend
      return NextResponse.json(backendData, { status: backendRes.status });
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
