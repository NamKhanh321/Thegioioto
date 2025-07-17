import { NextRequest, NextResponse } from 'next/server';

// Ensure NEXT_PUBLIC_API_ENDPOINT is set in your Vercel environment variables
// Example: NEXT_PUBLIC_API_ENDPOINT=https://your-render-backend-url.onrender.com
const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function POST(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    console.error('NEXT_PUBLIC_API_ENDPOINT is not defined.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Parse the request body coming from the frontend
    const body = await req.json();

    // 1. Forward the login request to your Express backend on Render
    const backendRes = await fetch(`${RENDER_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const backendData = await backendRes.json();

    if (backendRes.ok) {
      // 2. Extract the 'Set-Cookie' header from the backend's response
      const setCookieHeader = backendRes.headers.get('Set-Cookie');

      // Create a new NextResponse instance to modify its cookies
      const response = NextResponse.json(backendData, { status: backendRes.status });

      if (setCookieHeader) {
        // This is a simplified parsing for a single 'Set-Cookie' header.
        // For more complex scenarios with multiple cookies or specific attributes,
        // you might need a more robust cookie parsing library.
        const cookieParts = setCookieHeader.split(';').map(s => s.trim());
        const [cookieNameValue] = cookieParts; // e.g., "access_token=someValue"
        const [cookieName, cookieValue] = cookieNameValue.split('=');

        // 3. Set the cookie on the Next.js app's domain (thegioioto.vercel.app)
        // Ensure options match how you want the cookie to behave on the client side.
        response.cookies.set(cookieName, cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // true if your Vercel app is on HTTPS
          path: '/',
          // 'Lax' is generally safe for same-site (Vercel app domain)
          // 'None' is for cross-site, but here the cookie is set by the same domain as the app
          sameSite: 'lax',
          maxAge: 3600000, // 1 hour (match your backend's maxAge if possible)
        });
      }

      return response;

    } else {
      // Forward backend errors to the frontend
      return NextResponse.json(backendData, { status: backendRes.status });
    }
  } catch (error) {
    console.error('Error in /api/login proxy:', error);
    return NextResponse.json({ message: 'Internal server error during login.' }, { status: 500 });
  }
}
