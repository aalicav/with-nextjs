import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  author: string;
  content: string;
  rating: number;
  createdAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
