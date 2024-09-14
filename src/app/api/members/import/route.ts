import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";
import Tiktok from "@tobyg74/tiktok-api-dl";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Dados inválidos. Esperava-se um array de membros." },
        { status: 400 }
      );
    }

    // Pré-processamento dos dados
    const membersToInsert = await Promise.all(
      data.map(async (memberData) => {
        // Validar dados do membro
        if (
          !memberData.email ||
          !memberData.whatsapp ||
          !memberData.tiktokProfile
        ) {
          throw new Error("Dados incompletos para o membro");
        }

        // Buscar informações do TikTok
        if (memberData.tiktokProfile) {
          try {
            const tiktokProfile = memberData.tiktokProfile.split("@");
            memberData.tiktokUsername = tiktokProfile[1];
          } catch (error) {
            console.error("Erro ao buscar informações do TikTok:", error);
          }
        }

        // Definir valores padrão
        memberData.coins = memberData.coins || 0;
        memberData.isJailed = memberData.isJailed || false;

        return memberData;
      })
    );

    // Inserir múltiplos membros de uma vez
    const result = await Member.insertMany(membersToInsert, { ordered: false });

    return NextResponse.json(
      {
        message: `${result.length} membros criados com sucesso.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao importar membros:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Erro desconhecido ao importar membros" },
      { status: 500 }
    );
  }
}
