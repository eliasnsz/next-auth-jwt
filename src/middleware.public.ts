import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  
  const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET as string)

  const isUrl = (matchUrl: string) => req.url.endsWith(matchUrl)
  const token = req.cookies.get("session-token")?.value as string

  if (isUrl("/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  
  if (isUrl("/login") || isUrl("/cadastro")) {

    if(token) {
      const decoded = await jwtVerify(token, jwtSecret)
      return NextResponse.redirect(new URL("/", req.url))
    }
  }
  
  
  return NextResponse.next()
}

export const config = {
  matcher: "/:path*"
}