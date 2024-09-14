import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import connectToDatabase from "@db/mongo";
import { authMiddleware } from "@/middleware/authMiddleware";

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

    if (searchParams.get("author")) {
      filters.author = { $regex: searchParams.get("author"), $options: "i" };
    }
    if (searchParams.get("rating")) {
      filters.rating = parseInt(searchParams.get("rating") as string);
    }

    const sort: any = {};
    if (searchParams.get("_sort")) {
      const sortField = searchParams.get("_sort");
      const sortOrder = searchParams.get("_order") === "desc" ? -1 : 1;
      sort[sortField as string] = sortOrder;
    }

    const totalCount = await Testimonial.countDocuments(filters);
    const testimonials = await Testimonial.find(filters)
      .sort(sort)
      .skip(start)
      .limit(limit);

    const response = NextResponse.json(testimonials);
    response.headers.set("X-Total-Count", totalCount.toString());
    response.headers.set("Access-Control-Expose-Headers", "X-Total-Count");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar testimonials" },
      { status: 500 }
    );
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
    const newTestimonial = await Testimonial.create(data);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar testimonial" },
      { status: 500 }
    );
  }
}
