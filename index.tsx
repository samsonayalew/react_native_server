// import cors from "cors";
import {connect} from "mongoose";
import {json, urlencoded, application} from "express";

const { DATABASE } = require("./config");

const authRoutes = require("./routes/auth");
const PostRoutes = require("./routes/post");

const morgan = require("morgan");

// const applicationlication = express();

// db connection+
  connect(DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err: any) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
application.use(json({ limit: "4mb" }));
application.use(urlencoded({ extended: true }));
// applicationlication.use(cors());
application.use(morgan("dev"));

// route middlewares
application.use("/api", authRoutes);
application.use("/api", PostRoutes);

application.listen(8000, () => console.log("Server running on port 8000"));
