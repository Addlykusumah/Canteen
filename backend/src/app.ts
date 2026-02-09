import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


import login from "./routers/authRoute";
import regrister from "./routers/regristerRoute";
import SiswaAdmin from "./routers/siswaadminRoute";
import menuRoute from "./routers/menuRoute";
import diskonRoute from "./routers/diskonRoute";
import transaksiRoute from "./routers/transaksiRoute";
import detailtransaksiRoute from "./routers/detailtransaksiRoute";
import siswa from "./routers/siswaRoute";
import stan from "./routers/adminRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));


app.use("/", regrister);

app.use("/", stan);

app.use("/", siswa);

app.use("/user", login);

app.use("/", SiswaAdmin);

app.use("/", menuRoute);

app.use("/admin", diskonRoute);

app.use("/", transaksiRoute);

app.use ("/", detailtransaksiRoute)




export default app;
