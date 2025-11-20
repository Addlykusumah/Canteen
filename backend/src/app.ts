import express from "express";
import cors from "cors";

import siswaRoutes from "./routers/siswaRoute";
import siswaUpdateRoutes from "./routers/siswaUpdateRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// REGISTER dan LOGIN route
app.use("/api", siswaRoutes);

// UPDATE route
app.use("/api", siswaUpdateRoutes);

export default app;
