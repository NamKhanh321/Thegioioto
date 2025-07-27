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
      // const setCookieHeader = backendRes.headers.get('Set-Cookie');

      const response = NextResponse.json(backendData, { status: backendRes.status });

      // if (setCookieHeader) {
      //   // Thuật toán trích xuất 1 cookies đơn giản, có thể cải tiến trong trường hợp xử lý nhiều cookies cùng lúc
      //   const cookieParts = setCookieHeader.split(';').map(s => s.trim());
      //   const [cookieNameValue] = cookieParts; // e.g., "access_token=someValue"
      //   const [cookieName, cookieValue] = cookieNameValue.split('=');

      //   // 3. Tạo cookie với tên miền của next.js app (thegioioto.vercel.app)
      //   response.cookies.set(cookieName, cookieValue, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     path: '/',
      //     // 'Lax' is generally safe for same-site (Vercel app domain)
      //     // 'None' is for cross-site, but here the cookie is set by the same domain as the app
      //     sameSite: 'lax',
      //     maxAge: 3600, // Tính theo giây
      //   });
      // }
      // **MODIFICATION START HERE**

        // 2. Get the access token directly from the backendData JSON body
        const accessToken = backendData.accessToken; // Assumed field name from your API backend response

        if (accessToken) {
            // 3. Set the cookie for the user's browser using the token from the JSON body
            response.cookies.set('access_token', accessToken, { // Use a consistent name like 'access_token'
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                path: '/', // Cookie is valid for all paths on your Next.js domain
                sameSite: 'lax', // 'Lax' is a good default for CSRF protection
                maxAge: 3600, // Cookie expires in 1 hour (3600 seconds) - adjust to your JWT's actual expiry
            });
        } else {
            // Log a warning if login was successful but no token was provided (shouldn't happen with correct backend)
            console.warn('Backend login successful but no accessToken found in response body.');
        }

        // **MODIFICATION END HERE**

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
