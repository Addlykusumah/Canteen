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
import diskonRoute from "./routers/diskonRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use("/api", siswaRoutes);

app.use("/api", siswaUpdateRoutes);

app.use("/api", siswaProfileRoute);

app.use("/", regristerStanRoute);

app.use("/user", login);

app.use("/api", SiswaAdmin);

app.use("/admin", menuRoute);

app.use("/admin", diskonRoute);

export default app;
