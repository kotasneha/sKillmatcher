import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','rejected','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

bookingSchema.index({ service_id: 1, date: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);
