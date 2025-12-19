import { Types, Document } from "mongoose";
import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Email incorrect" }),
  password: z.string(),
});
export const NoteSchema = z.object({
  title: z.string(),
  important: z.boolean(),
  tags: z.array(z.string()).optional(),
  content: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
export interface User extends z.infer<typeof userSchema>{
  googleId?: string;
  birthdate: string;
  nationality: string;
  profilePhoto: string;
}
export interface NoteDocument extends Note, Document {
  userID: Types.ObjectId;
}
export type UserSession = Pick<NoteDocument, "userID">;
export class HttpError extends Error {
  // Custom error class for HTTP errors
  status: number;
  constructor(error: string, status: number) {
    super(error);
    this.status = status;
  }
}
export type queryFilter = {
  userID: Types.ObjectId;
  title?: string | { $regex: string; $options?: string };
};
