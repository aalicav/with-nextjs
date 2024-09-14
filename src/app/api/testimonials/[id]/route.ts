import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const testimonial = await Testimonial.findById(params.id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial não encontrado" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar testimonial" }, { status: 500 });
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
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedTestimonial) {
      return NextResponse.json({ error: "Testimonial não encontrado" }, { status: 404 });
    }
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar testimonial" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) {
    return authResponse;
  }

  try {
    await connectToDatabase();
    const deletedTestimonial = await Testimonial.findByIdAndDelete(params.id);
    if (!deletedTestimonial) {
      return NextResponse.json({ error: "Testimonial não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Testimonial excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir testimonial" }, { status: 500 });
  }
}