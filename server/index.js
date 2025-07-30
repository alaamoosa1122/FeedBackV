import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import EventModel from "./Models/EventModel.js";
import FeedbackModel from "./Models/FeedbackModel.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://feedback-client.onrender.com', 'https://feedbackv-server1.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'Content-Length'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for health check
app.get("/", (req, res) => {
  res.json({ message: "Feedback Server is running!" });
});

// MongoDB Connection
const con = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@peercluster.xixmr.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=peerCluster`;
mongoose.connect(con)
  .then(() => console.log("Alaa MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// إضافة فعالية جديدة
app.post("/events", async (req, res) => {
  try {
    const { en, ar } = req.body;
    if (!en || !ar) return res.status(400).json({ msg: "Both English and Arabic names are required" });
    const event = new EventModel({ en, ar });
    await event.save();
    res.status(201).json({ msg: "Event added successfully", event });
  } catch (error) {
    res.status(500).json({ msg: "Error adding event", error });
  }
});

// جلب كل الفعاليات
app.get("/events", async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching events", error });
  }
});

// إضافة تقييم جديد
app.post("/feedback", async (req, res) => {
  try {
    const { name,number, event, rating, comments } = req.body;
    if (!name ||!number || !event || !rating || !comments) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const feedback = new FeedbackModel({ name, number, event, rating, comments });
    await feedback.save();
    res.status(201).json({ msg: "Feedback added successfully", feedback });
  } catch (error) {
    res.status(500).json({ msg: "Error adding feedback", error });
  }
});

// جلب كل التقييمات
app.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching feedbacks", error });
  }
});

// حذف تقييم
app.delete("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeedbackModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Feedback not found" });
    res.json({ msg: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting feedback", error });
  }
});

// حذف فعالية
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EventModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Event not found" });
    // Delete all feedbacks for this event (by en or ar name)
    await FeedbackModel.deleteMany({ event: { $in: [deleted.en, deleted.ar] } });
    res.json({ msg: "Event and related feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting event", error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
