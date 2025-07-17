import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Recommended for Edge environments

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  // const isProtectedRoute = pathname === '/shopping';
  const isCustomerRoute = pathname === '/shopping' || pathname === '/category' || pathname === '/service';
  const isAdminRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  // chuyển hướng về trang login nếu không có token
  if (!token && (isCustomerRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname); // Thêm param để chuyển hướng lại về trang người dùng muốn truy cập khi chưa có token hợp lệ (sử dụng ở login-form)
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      // Kiểm tra token
      const {payload} = await jwtVerify(token, secret);
      const role = payload.role;

      // Nếu đã đăng nhập mà yêu cầu url đến trang login / register, chuyển hướng về trang chủ
      if (isAuthRoute) {
        const dashboardUrl = new URL('/', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
      else if(isAdminRoute && role !== 'admin') {
        throw new Error('Lỗi ủy quyền');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // chuyển hướng về trang login nếu token không hợp lệ
      // const loginUrl = new URL('/login', req.url);
      // loginUrl.searchParams.set('from', pathname); // Thêm param để chuyển hướng lại về trang người dùng muốn truy cập khi chưa có token hợp lệ
      // const response = NextResponse.redirect(loginUrl);
      // // xóa token không hợp lệ
      // response.cookies.delete('access_token');

      // Decide on redirect based on target path:
      if (isCustomerRoute || isAdminRoute) {
        // If on a protected route with an invalid token, redirect to login
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('access_token'); // Attach cookie deletion to the redirect response
        return response;
      }

      // For other cases, just delete the cookie and proceed
      const response = NextResponse.next();
      response.cookies.delete('access_token');
      return response;
    }
  }

  return NextResponse.next();
}

// thêm các route cần bảo vệ tại đây
export const config = {
  matcher: ['/shopping',
    '/login',
    '/register',
    '/dashboard/:path*'
  ],
};