"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import cors from "cors";
const mongoose_2 = require("mongoose");
const express_1 = require("express");
const { DATABASE } = require("./config");
const authRoutes = require("./routes/auth");
const PostRoutes = require("./routes/post");
const morgan = require("morgan");
// const applicationlication = express();
// db connection+
(0, mongoose_2.connect)(DATABASE)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB CONNECTION ERROR: ", err));
// middlewares
express_1.application.use((0, express_1.json)({ limit: "4mb" }));
express_1.application.use((0, express_1.urlencoded)({ extended: true }));
// applicationlication.use(cors());
express_1.application.use(morgan("dev"));
// route middlewares
express_1.application.use("/api", authRoutes);
express_1.application.use("/api", PostRoutes);
express_1.application.listen(8000, () => console.log("Server running on port 8000"));
