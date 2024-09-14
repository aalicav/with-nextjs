import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const imageId = params.id;

  if (!imageId) {
    return NextResponse.json({ error: "ID da imagem não fornecido" }, { status: 400 });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI não está definido");
    }

    const client = await MongoClient.connect(mongoUri);
    const db = client.db();
    const bucket = new GridFSBucket(db);

    const downloadStream = bucket.openDownloadStream(new ObjectId(imageId));

    // Verificar se o arquivo existe
    const file = await db.collection('fs.files').findOne({ _id: new ObjectId(imageId) });
    if (!file) {
      await client.close();
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
    }

    // Preparar o stream de resposta
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await client.close();

    // Configurar os headers da resposta
    const headers = new Headers();
    headers.set("Content-Type", file.contentType);
    headers.set("Content-Length", buffer.length.toString());
    headers.set("Content-Disposition", `inline; filename="${file.filename}"`);

    // Retornar a imagem como resposta
    return new NextResponse(buffer, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Erro ao recuperar imagem:", error);
    return NextResponse.json(
      { error: "Erro ao recuperar imagem" },
      { status: 500 }
    );
  }
}