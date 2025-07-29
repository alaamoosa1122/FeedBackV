import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
});

const EventModel = mongoose.model('Event', EventSchema);
export default EventModel; 