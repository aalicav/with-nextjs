import { NextResponse } from "next/server";
import User from "@/models/User";
import { decrypt, encrypt } from "@/utils/crypto";
import connectToDatabase from "@db/mongo";
import { generateToken } from "@/utils/jwt";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    debugger;
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }


    if (user.password !== password) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
