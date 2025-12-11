//Importing necessary modules
import express from "express";
import "dotenv/config";
import cors from "cors";
// import http from "http";  // COMMENTED OUT: Not needed for Vercel serverless
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
// import { Server } from "socket.io";  // COMMENTED OUT: Socket.io not compatible with Vercel serverless functions

//Creating Express app (removed HTTP server for Vercel compatibility)
const app = express();
// const server = http.createServer(app);  // COMMENTED OUT: Vercel handles HTTP server

// COMMENTED OUT: Socket.io initialization - not compatible with Vercel serverless
// export const io = new Server(server, {
//   cors: {origin: "*"}
// });

//Store online users
export const userSocketMap = {};

// COMMENTED OUT: Socket.io connection handler - for development only
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);

//   if(userId) userSocketMap[userId] = socket.id;

//   // Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

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

//connecting to database
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error);
});

const PORT = process.env.PORT || 5000;

// COMMENTED OUT: HTTP server listening - not needed for Vercel serverless
// if (process.env.NODE_ENV !== "production") {
//   server.listen(PORT, () => {
//     console.log(`Server is running on PORT : ${PORT}`);
//   });
// }

//Exporting app for vercel deployment
export default app;