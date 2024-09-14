import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "@/utils/jwt";

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const decodedToken = validateToken(token);

  if (!decodedToken) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  // @ts-ignore
  req.user = decodedToken;
  return NextResponse.next();
}