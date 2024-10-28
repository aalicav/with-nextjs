import { NextRequest, NextResponse } from "next/server";
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";
import Tiktok from "@tobyg74/tiktok-api-dl";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("_page") || "1");
    const limit = parseInt(searchParams.get("_limit") || "10");
    const start = (page - 1) * limit;

    const filters: any = {};

    // Adicione os filtros conforme necessário
    if (searchParams.get("name")) {
      filters.name = { $regex: searchParams.get("name"), $options: "i" };
    }
    if (searchParams.get("email")) {
      filters.email = { $regex: searchParams.get("email"), $options: "i" };
    }
    // ... (outros filtros permanecem os mesmos)

    const sort: any = {};
    if (searchParams.get("_sort")) {
      const sortField = searchParams.get("_sort");
      const sortOrder = searchParams.get("_order") === "desc" ? -1 : 1;
      sort[sortField as string] = sortOrder;
    }

    const totalCount = await Member.countDocuments(filters);
    const members = await Member.find(filters)
      .sort(sort)
      .skip(start)
      .limit(limit)

    const response = NextResponse.json(members);
    response.headers.set("X-Total-Count", totalCount.toString());
    response.headers.set("Access-Control-Expose-Headers", "X-Total-Count");

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar membros" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const data = await req.json();

    // Validar dados obrigatórios
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    // Buscar informações do TikTok
    if (data.tiktokProfile) {
      try {
        const tiktokProfile = data.tiktokProfile.split('@').pop();
        const userInfo = await Tiktok.Search(tiktokProfile, {
          type: "user",
          page: 1,
        });

        if (userInfo.status === "success" && userInfo.result) {
          data.tiktokUsername = userInfo?.result[0]?.nickname;
          data.tiktokProfilePicture = userInfo?.result[0]?.avatarThumb;
        }
      } catch (error) {
        console.error("Erro ao buscar informações do TikTok:", error);
      }
    }

    // Definir valores padrão
    data.coins = data.coins || 0;
    data.isJailed = data.isJailed || false;

    const newMember = await Member.create(data);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json({ error: "Erro ao criar membro" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();
    const updatedMember = await Member.findByIdAndUpdate(id, data, { new: true });
    if (!updatedMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar membro" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Membro excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir membro" }, { status: 500 });
  }
}

// ... outros métodos (PUT, DELETE)
