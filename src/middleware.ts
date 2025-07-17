import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Recommended for Edge environments

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = pathname === '/introduce';
  // const isCustomerRoute = pathname === '/shopping' || pathname === '/category' || pathname === '/service';
  const isAdminRoute = pathname.startsWith('/dashboard');
  console.log(isAdminRoute);
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  // chuyển hướng về trang login nếu không có token
  if (!token && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname); // Thêm param để chuyển hướng lại về trang người dùng muốn truy cập khi chưa có token hợp lệ (sử dụng ở login-form)
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      // Kiểm tra token
      // const {payload} = 
      await jwtVerify(token, secret);
      // const role = payload.role;

      // Nếu đã đăng nhập mà yêu cầu url đến trang login / register, chuyển hướng về trang chủ
      if (isAuthRoute) {
        const dashboardUrl = new URL('/', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // chuyển hướng về trang login nếu token không hợp lệ
      // const loginUrl = new URL('/login', req.url);
      // loginUrl.searchParams.set('from', pathname); // Thêm param để chuyển hướng lại về trang người dùng muốn truy cập khi chưa có token hợp lệ
      // const response = NextResponse.redirect(loginUrl);
      // // xóa token không hợp lệ
      // response.cookies.delete('access_token');
      // return response;
      // Prepare a response that deletes the invalid cookie
      const response = NextResponse.next(); // Default: allow request to proceed
      response.cookies.delete('access_token'); // Delete the invalid cookie

      // Decide on redirect based on target path:
      if (isProtectedRoute || isAdminRoute) {
        // If on a protected route with an invalid token, redirect to login
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

// thêm các route cần bảo vệ tại đây
export const config = {
  matcher: ['/introduce',
    '/login',
    '/register',
    '/dashboard/:path*'
  ],
};