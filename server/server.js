//Importing necessary modules
import express from "express";
import "dotenv/config";
import cors from "cors";
// COMMENTED OUT FOR VERCEL DEPLOYMENT: Socket.io initialization removed for serverless compatibility
// import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
// COMMENTED OUT FOR VERCEL DEPLOYMENT: Socket.io is incompatible with Vercel's serverless functions
// import { Server } from "socket.io";

// VALIDATION: Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  // Continue anyway to avoid immediate crash - endpoints will fail gracefully
}

//Creating Express app
// COMMENTED OUT FOR VERCEL DEPLOYMENT: HTTP server creation removed - using Express directly
// const server = http.createServer(app);
const app = express();

// COMMENTED OUT FOR VERCEL DEPLOYMENT: Socket.io initialization
// export const io = new Server(server, {
//   cors: {origin: "*"}
// });

//Store online users - will be reset on each function invocation
export const userSocketMap = {};

// COMMENTED OUT FOR VERCEL DEPLOYMENT: Socket.io event handlers removed
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);
//
//   if(userId) userSocketMap[userId] = socket.id;
//
//   // Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));
//
//   socket.on("disconnect", () => {
//     console.log("User Disconnected", userId);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// })

//Middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// /api/status is an api endpoint to check server status, i.e. it is running or not
app.use("/api/status", (req, res) => {
  res.send("Server is running");
});

//route setup
app.use("/api/auth", userRouter);// another way to import user routes --> require("./routes/authRoutes.js").default instead of userRouter
app.use("/api/messages", messageRouter);

// ADDED: Catch-all 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({success: false, message: "Route not found"});
});

// ADDED ERROR HANDLING: Global error handling middleware to catch unhandled errors
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({success: false, message: err.message || "Internal Server Error"});
});

//connecting to database
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error);
});

const PORT = process.env.PORT || 5000;

// COMMENTED OUT FOR VERCEL DEPLOYMENT: HTTP server listen removed
// Starting the server for development only
// if (process.env.NODE_ENV !== "production") {
//   server.listen(PORT, () => {
//     console.log(`Server is running on PORT : ${PORT}`);
//   });
// }

//Exporting app for vercel deployment - Express app is invoked directly by Vercel runtime
export default app;