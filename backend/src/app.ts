import express from "express";
import siswaRoutes from "./routers/siswaRoute";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// serve file upload
app.use("/uploads", express.static("uploads"));

// routing
app.use("/api", siswaRoutes);

export default app;
