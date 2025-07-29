import { Server } from 'socket.io';
import { GenericChatModel as ChatModel } from './Models/ChatModel.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3001", "http://localhost:5000"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", async ({ roomId, chatType, referenceId }) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      
      // Get chat history when joining
      try {
        const chatHistory = await ChatModel.findOne({ 
          roomId,
          chatType,
          referenceId
        });
        
        if (chatHistory) {
          socket.emit('chatHistory', chatHistory.messages);
        } else {
          socket.emit('chatHistory', []);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        socket.emit('chatHistory', []);
      }
    });

    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const { roomId, chatType, referenceId, content, sender, senderEmail, replyTo } = messageData;
        const message = {
          sender,
          senderEmail,
          content,
          timestamp: new Date()
        };

        // Add reply information if present
        if (replyTo) {
          message.replyTo = {
            messageId: replyTo.messageId,
            content: replyTo.content,
            sender: replyTo.sender,
            senderEmail: replyTo.senderEmail
          };
        }

        // Save message to database
        await ChatModel.findOneAndUpdate(
          { 
            roomId,
            chatType,
            referenceId
          },
          { 
            $push: { messages: message },
            $setOnInsert: { 
              roomId,
              chatType,
              referenceId
            }
          },
          { upsert: true }
        );

        // Broadcast to all clients in the room
        io.to(roomId).emit("message", message);
        console.log(`Message sent in room ${roomId}`);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export default setupSocket;