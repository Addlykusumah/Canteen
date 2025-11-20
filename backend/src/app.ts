import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import siswaRoutes from "./routers/siswaRoute";
import siswaUpdateRoutes from "./routers/siswaUpdateRoute";
import loginSiswaRoute from "./routers/authRoute";
import siswaProfileRoute from "./routers/siswaprofileRoute";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// REGISTER dan LOGIN route
app.use("/api", siswaRoutes);

// UPDATE route
app.use("/api", siswaUpdateRoutes);

//login Siswa 
app.use("/api", loginSiswaRoute);

//siswa profile
app.use("/api", siswaProfileRoute);


export default app;
