import { User } from "../types";
import { model, Schema } from "mongoose";

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    unique: false
  },
  googleId: { type: String, unique: true, sparse: true },
  profilePhoto: { 
    type: String, 
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
    }
  },
  nationality: { type: String, default: "" },
  birthdate: { type: String, default: "" }
});
export const UserModel = model<User>("Users", UserSchema);
