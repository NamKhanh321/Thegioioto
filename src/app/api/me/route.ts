import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function GET(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    console.error('NEXT_PUBLIC_API_ENDPOINT is not defined.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  // 1. Get the 'access_token' cookie from the incoming request to this Next.js API Route
  // req.cookies.get() is the correct way to read cookies in App Router API Routes.
  const accessTokenCookie = req.cookies.get('access_token');
  const accessToken = accessTokenCookie?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No authentication token found.' }, { status: 401 });
  }

  try {
    // 2. Forward the request to your Express backend's /api/auth/me endpoint.
    // Crucially, you need to forward the access_token to the backend.
    // The backend expects it as a cookie, so reconstruct the 'Cookie' header.
    const backendRes = await fetch(`${RENDER_BACKEND_URL}/api/auth/me`, {
      method: 'GET', // Assuming your backend's /api/auth/me is a GET request
      headers: {
        'Content-Type': 'application/json',
        // Forward the cookie to the backend. The backend will then verify it.
        'Cookie': `access_token=${accessToken}`,
      },
    });

    const backendData = await backendRes.json();

    if (backendRes.ok) {
      // 3. Send the user data received from the backend back to the frontend
      return NextResponse.json(backendData, { status: backendRes.status });
    } else {
      // Forward backend errors (e.g., if the token is invalid or expired)
      return NextResponse.json(backendData, { status: backendRes.status });
    }
  } catch (error) {
    console.error('Error in /api/auth/me proxy:', error);
    return NextResponse.json({ message: 'Internal server error during user fetch.' }, { status: 500 });
  }
}
