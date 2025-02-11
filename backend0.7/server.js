import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./db/mdb.js";
import { errorHandler } from "./middleware/ErrorHandler.js";
//Routers
import authRouter from "./routes/authRouter.js";
import personRouter from "./routes/personRouter.js";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(
  cors({
    // Specify the exact origin
    origin: ["https://localhost:5173", "http://localhost:5173"],
    // Allow credentials
    credentials: true,
  })
);

// cookie-parser
app.use(cookieParser());

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the Genealogy Tree App");
});

// Person Routes
app.use("/api/person", personRouter);

// User Routes
app.use("/api/users", authRouter);

app.use(errorHandler);

// Server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
