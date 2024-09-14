import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function PUT(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const { ids, data } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const result = await Member.updateMany(
      { _id: { $in: ids } },
      { $set: data },
      { new: true }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Nenhum membro foi atualizado" }, { status: 404 });
    }

    return NextResponse.json({}, {status: 200});
  } catch (error) {
    console.error("Erro na edição em massa:", error);
    return NextResponse.json({ error: "Erro ao atualizar membros" }, { status: 500 });
  }
}