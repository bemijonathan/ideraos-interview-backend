// password ->  email ->  token (exp 5min) -> verify  ->  newpassword token
import { multerUploads } from "../config/multer.config";
import ProductUpload from "../upload";
import { Router } from "express";
import { signin, signup, forgotEmail, newEmail } from "./auth";

const AuthRouter = Router();

const validate = (req, res, next) => {
	if (
		!req.body.email ||
		!req.body.about ||
		!req.body.name ||
		!req.body.password.trim()
	) {
		console.log(req.body, req.file);
		return res.status(400).send({ error: "missing fields" });
	} else {
		next();
	}
};

AuthRouter.route("/recovery").post(forgotEmail).put(newEmail);
AuthRouter.route("/signup").post(
	validate,
	multerUploads,
	ProductUpload,
	signup
);
AuthRouter.route("/signin").post(signin);

export default AuthRouter;
