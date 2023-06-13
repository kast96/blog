import mongoose, { Document } from "mongoose"

interface IUser extends Document {
  firstName: string
  email: string
  passwordHash: string
  avatarUrl: string
  _doc: any
}

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  }
}, {
  timestamps: true
})

export default mongoose.model('User', UserSchema)