import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number:{ type: Number, required: true },
  event: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
export default FeedbackModel; 