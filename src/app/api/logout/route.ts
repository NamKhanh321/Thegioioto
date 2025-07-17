import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  if (!RENDER_BACKEND_URL) {
    console.error('NEXT_PUBLIC_API_ENDPOINT is not defined.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // 1. (Optional) Inform the Express backend about logout for its own session cleanup
    // This is good practice if your backend maintains any session state or token blacklists.
    await fetch(`${RENDER_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      // No need to send body or specific headers unless your backend's logout requires them
    });

    // 2. Create a response to clear the cookie on the Next.js app's domain
    const response = NextResponse.json({ message: 'Đăng xuất thành công' }, { status: 200 });

    // 3. Delete the 'access_token' cookie from the client's browser
    // NextResponse.cookies.delete() is the preferred way in App Router
    response.cookies.delete('access_token');
    // If you need more specific control over deletion options (e.g., path, sameSite):
    // response.cookies.set('access_token', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   path: '/',
    //   expires: new Date(0), // Set expiry to a past date to clear
    //   sameSite: 'Lax',
    // });

    return response;
  } catch (error) {
    console.error('Error in /api/logout proxy:', error);
    return NextResponse.json({ message: 'Internal server error during logout.' }, { status: 500 });
  }
}
