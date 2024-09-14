import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import Member from "@/models/Member";
import connectToDatabase from "@db/mongo";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const memberId = formData.get('memberId') as string;

    if (!image || !memberId) {
      return NextResponse.json({ error: 'Imagem ou ID do membro não fornecidos' }, { status: 400 });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI não está definido");
    }

    const client = await MongoClient.connect(mongoUri);
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Excluir a imagem antiga se existir
    if (member.profileImageId) {
      await bucket.delete(new ObjectId(member.profileImageId)).catch(() => {});
    }

    // Upload da nova imagem
    const buffer = await image.arrayBuffer();
    const uploadStream = bucket.openUploadStream(image.name, {
      contentType: image.type,
    });

    uploadStream.end(Buffer.from(buffer));

    const imageId = uploadStream.id.toString();

    // Atualizar o profileImageId do membro
    member.profileImageId = imageId;
    await member.save();

    await client.close();

    return NextResponse.json({ imageId });
  } catch (error) {
    console.error('Erro ao processar o upload da imagem:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}