import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";
import Tiktok from "@tobyg74/tiktok-api-dl";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    const memberWithDateBirthDate = {
      ...member.toJSON(),
      birthDate: new Date(member.birthDate),
      brasaoReceivedDate: member.brasaoReceivedDate ? new Date(member.brasaoReceivedDate) : null
    };
    return NextResponse.json(memberWithDateBirthDate);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar membro" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const data = await req.json();
    const currentMember = await Member.findById(params.id);

    if (!currentMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }

    // Atualizar campos
    if (data.name) currentMember.name = data.name;
    if (data.email) currentMember.email = data.email;
    if (data.password) currentMember.password = data.password;
    // ... (atualizar outros campos conforme necessário)

    // Buscar informações do TikTok se o perfil foi alterado
    if (data.tiktokProfile && data.tiktokProfile !== currentMember.tiktokProfile) {
      try {
        const tiktokProfile = data.tiktokProfile.split('@').pop();
        const userInfo = await Tiktok.Search(tiktokProfile, {
          type: "user",
          page: 1,
        });

        if (userInfo.status === "success" && userInfo.result) {
          currentMember.tiktokUsername = userInfo?.result[0]?.nickname;
          currentMember.tiktokProfilePicture = userInfo?.result[0]?.avatarThumb;
        }
      } catch (error) {
        console.error("Erro ao buscar informações do TikTok:", error);
      }
    }

    await currentMember.save();
    return NextResponse.json(currentMember);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar membro" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const deletedMember = await Member.findByIdAndDelete(params.id);
    if (!deletedMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Membro excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir membro" }, { status: 500 });
  }
}