import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const member = await Member.findById(params.id);
    if (!member) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }

    member.liveParticipations.push({ date: new Date() });
    await member.save();

    return NextResponse.json({ message: "Participação registrada com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar participação" }, { status: 500 });
  }
}