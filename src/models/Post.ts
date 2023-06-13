import mongoose, { Document, SchemaDefinitionProperty } from "mongoose"

interface IPost extends Document {
  title: string
  text: string
  tags: Array<string>
  imageUrl: string
  viewsCount: number
  user: SchemaDefinitionProperty<string>
  _doc: any
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Post', PostSchema)