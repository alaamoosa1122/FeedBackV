const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./Models/UserModel");
const CourseModel = require("./Models/CourseModel");
const NoteModel = require("./Models/NoteModel");
const MeetingModel = require("./Models/MeetingModel");
const CommentModel = require("./Models/CommentModel");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/library");

// Middleware for verifying JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, "your-secret-key");
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// User registration
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, "your-secret-key", {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, "your-secret-key", {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get user profile
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a course
app.post("/addCourse", verifyToken, async (req, res) => {
  try {
    const { courseName, courseCode } = req.body;

    // Check if course already exists
    const existingCourse = await CourseModel.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ msg: "Course already exists" });
    }

    const newCourse = new CourseModel({
      courseName,
      courseCode,
    });

    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({ msg: "Failed to add course" });
  }
});

// Get all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ msg: "Failed to fetch courses" });
  }
});

// Upload a note
app.post("/uploadNote", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { courseCode, noteName } = req.body;
    if (!courseCode || !noteName) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const newNote = new NoteModel({
      courseCode,
      noteName,
      fileUrl: path.join("uploads", req.file.filename),
      uploader: req.user.username,
      uploaderEmail: req.user.email,
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0
    });

    await newNote.save();
    res.json({ msg: "Note uploaded successfully", note: newNote });
  } catch (error) {
    console.error("Upload note error:", error);
    res.status(500).json({ msg: "Failed to upload note" });
  }
});

// Get notes by course
app.get("/notes/:courseCode", async (req, res) => {
  try {
    const notes = await NoteModel.find({ courseCode: req.params.courseCode });
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Delete Note
app.delete("/deleteNote/:noteId", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if the user is the uploader
    if (note.uploaderEmail !== req.user.email) {
      return res.status(403).json({ msg: "You can only delete your own notes" });
    }

    // Delete the note
    await NoteModel.findByIdAndDelete(noteId);

    // Delete the file
    const filePath = path.join(process.cwd(), note.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ msg: "Note deleted successfully" });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ msg: "Failed to delete note" });
  }
});

// Like a note
app.post("/notes/:noteId/like", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userEmail = req.user.email;

    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user has already liked or disliked
    const hasLiked = note.likes.includes(userEmail);
    const hasDisliked = note.dislikes.includes(userEmail);

    if (hasLiked) {
      // Unlike if already liked
      note.likes = note.likes.filter(email => email !== userEmail);
      note.likeCount--;
    } else {
      // Add like and remove from dislikes if previously disliked
      note.likes.push(userEmail);
      note.likeCount++;
      if (hasDisliked) {
        note.dislikes = note.dislikes.filter(email => email !== userEmail);
        note.dislikeCount--;
      }
    }

    await note.save();
    res.json({ msg: "Note rating updated", note });
  } catch (error) {
    console.error('Like note error:', error);
    res.status(500).json({ msg: "Failed to update note rating" });
  }
});

// Dislike a note
app.post("/notes/:noteId/dislike", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userEmail = req.user.email;

    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    // Check if user has already liked or disliked
    const hasLiked = note.likes.includes(userEmail);
    const hasDisliked = note.dislikes.includes(userEmail);

    if (hasDisliked) {
      // Remove dislike if already disliked
      note.dislikes = note.dislikes.filter(email => email !== userEmail);
      note.dislikeCount--;
    } else {
      // Add dislike and remove from likes if previously liked
      note.dislikes.push(userEmail);
      note.dislikeCount++;
      if (hasLiked) {
        note.likes = note.likes.filter(email => email !== userEmail);
        note.likeCount--;
      }
    }

    await note.save();
    res.json({ msg: "Note rating updated", note });
  } catch (error) {
    console.error('Dislike note error:', error);
    res.status(500).json({ msg: "Failed to update note rating" });
  }
});

// Get note ratings
app.get("/notes/:noteId/ratings", async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await NoteModel.findById(noteId).select('likes dislikes likeCount dislikeCount');
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.json({ ratings: note });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ msg: "Failed to get note ratings" });
  }
});

// Get single course
app.get("/course/:courseCode", async (req, res) => {
  try {
    const course = await CourseModel.findOne({ courseCode: req.params.courseCode });
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ msg: "Failed to fetch course" });
  }
});

// Add a meeting
app.post("/addMeeting", verifyToken, async (req, res) => {
  try {
    const { courseCode, title, description, date, time } = req.body;

    const newMeeting = new MeetingModel({
      courseCode,
      title,
      description,
      date,
      time,
      organizer: req.user.username,
      organizerEmail: req.user.email,
    });

    await newMeeting.save();
    res.json(newMeeting);
  } catch (error) {
    console.error('Add meeting error:', error);
    res.status(500).json({ msg: "Failed to add meeting" });
  }
});

// Get all meetings
app.get("/meetings", async (req, res) => {
  try {
    const meetings = await MeetingModel.find();
    res.json(meetings);
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ msg: "Failed to fetch meetings" });
  }
});

// Get meetings by course
app.get("/meetings/:courseCode", async (req, res) => {
  try {
    const meetings = await MeetingModel.find({ courseCode: req.params.courseCode });
    res.json(meetings);
  } catch (error) {
    console.error('Get course meetings error:', error);
    res.status(500).json({ msg: "Failed to fetch meetings" });
  }
});

// Add a comment to a note
app.post("/addComment", verifyToken, async (req, res) => {
  try {
    const { noteId, text } = req.body;

    const newComment = new CommentModel({
      noteId,
      text,
      commenter: req.user.username,
      commenterEmail: req.user.email,
    });

    await newComment.save();
    res.json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ msg: "Failed to add comment" });
  }
});

// Get comments for a note
app.get("/comments/:noteId", async (req, res) => {
  try {
    const comments = await CommentModel.find({ noteId: req.params.noteId });
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ msg: "Failed to fetch comments" });
  }
});

// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
