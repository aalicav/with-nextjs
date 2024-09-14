import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectToDatabase from "@db/mongo";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string, email: string, roles: string[] };
    } catch (error) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    if (!decodedToken.roles.includes('admin')) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const { email, password } = await req.json();

    const newUser = await User.create({ email, password, roles: ["admin"] });

    // Não envie a senha de volta ao cliente
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Erro ao registrar usuário" }, { status: 500 });
  }
}