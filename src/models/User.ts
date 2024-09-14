import mongoose, { Schema, Document } from 'mongoose';
import { encrypt, decrypt } from '@/utils/crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  roles: string[];
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    set: (v: string) => encrypt(v),
    get: (v: string) => decrypt(v)
  },
  password: {
    type: String,
    required: true,
    set: (v: string) => encrypt(v),
    get: (v: string) => decrypt(v)
  },
  roles: [{ type: String, required: true }],
});

// Garantir que os campos criptografados sejam descriptografados ao recuperar
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.email = decrypt(ret.email);
    // Não descriptografamos a senha aqui por segurança
    return ret;
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);