import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/home', '/login', '/unauthorized'];

const roleProtectedRoutes = {
  '/admin': ['admin', 'superadmin'],
  '/blog': ['user', 'admin', 'superadmin'],
  '/docs': ['user', 'admin', 'superadmin'],
};

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET');
  return new TextEncoder().encode(secret);
};

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return payload;
  } catch (err) {
    console.warn('JWT verification failed:', err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('🔐 Middleware hit:', pathname);

  if(pathname ==="/"){
    return NextResponse.redirect(new URL('/home', req.url));
  }
  // Allow public paths
  if (
    PUBLIC_PATHS.includes(pathname) || // exact match
    PUBLIC_PATHS.some((path) => path !== '/' && pathname.startsWith(`${path}/`))
  ) {
    return NextResponse.next();
  }
  

  // Get token from cookies
  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.warn('No token, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validate token
  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = payload.role as string | undefined;
  if (!userRole) {
    console.warn('Token has no role, redirecting to unauthorized');
    return NextResponse.redirect(new URL(`/unauthorized/${pathname}`, req.url));
  }

  // Role-based route protection
  for (const [protectedPath, allowedRoles] of Object.entries(roleProtectedRoutes)) {
    const exactMatch = pathname === protectedPath;
    const nestedMatch = pathname.startsWith(`${protectedPath}/`);

    if ((exactMatch || nestedMatch) && !allowedRoles.includes(userRole)) {
      console.warn(`Role ${userRole} not allowed to access ${pathname}`);
      return NextResponse.redirect(new URL(`/unauthorized/${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|static|api|.*\\..*).*)'], // Match everything except static, API, files
};
