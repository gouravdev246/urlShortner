import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Link', linkSchema);