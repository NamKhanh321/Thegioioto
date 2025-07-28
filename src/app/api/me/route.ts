import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function GET(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }

  const accessTokenCookie = req.cookies.get('access_token');
  const accessToken = accessTokenCookie?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Không tìm thấy token' }, { status: 404 });
  }

  try {
    // 2. Tìm thông tin user ở express server
    const backendRes = await fetch(`${RENDER_BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const backendData = await backendRes.json();

    // if (backendRes.ok) {
      // 3. Trả về kết quả
      return NextResponse.json(backendData, { status: backendRes.status });
    // } 
    // else {
    //   return NextResponse.json(backendData, { status: backendRes.status });
    // }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.error('Error in /api/auth/me proxy:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
