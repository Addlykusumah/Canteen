import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import siswaRoutes from "./routers/siswaRoute";
import siswaUpdateRoutes from "./routers/siswaUpdateRoute";
import login from "./routers/authRoute";
import siswaProfileRoute from "./routers/siswaprofileRoute";
import regristerStanRoute from "./routers/regristerstanRoute";
import SiswaAdmin from "./routers/siswaadminRoute";
import menuRoute from "./routers/menuRoute";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// REGISTER dan LOGIN route
app.use("/api", siswaRoutes);

// UPDATE route
app.use("/api", siswaUpdateRoutes);


//siswa profile
app.use("/api", siswaProfileRoute);

//register stan
app.use("/", regristerStanRoute);

app.use("/user", login);

app.use("/api", SiswaAdmin);

app.use("/api/admin", menuRoute);




export default app;
