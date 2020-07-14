import express from "express";
import morgan from "morgan";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { dbConnection } from "./config/db";
import AuthRouter from "./utils/auth.route";
import userRoute from "./resources/users/user.route";
import multer from "multer";

const app = express();
let upload = multer();

app.use(morgan("dev"));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(upload.single());

// routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", userRoute);

export const start = async (port) => {
	try {
		await dbConnection();
		app.listen(port, () => {
			console.log(`REST API on http://localhost:${port}/api`);
		});
	} catch (e) {
		console.error(e);
	}
};
