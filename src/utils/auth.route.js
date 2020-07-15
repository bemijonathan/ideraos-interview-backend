// password ->  email ->  token (exp 5min) -> verify  ->  newpassword token
import { multerUploads } from "../config/multer.config";
import ProductUpload from "../upload";
import { Router } from "express";
import { signin, signup, forgotEmail, newEmail } from "./auth";

const AuthRouter = Router();

const validate = (req, res, next) => {
	const { email, about, name, password } = req.body;
	if (
		email.length > 0 &&
		about.length > 0 &&
		name.length > 0 &&
		password.length > 0
	) {
		next();
	} else {
		return res.status(400).send({ error: "missing fields" });
	}
};

AuthRouter.route("/recovery").post(forgotEmail).put(newEmail);
AuthRouter.route("/signup").post(
	multerUploads,
	validate,
	ProductUpload,
	signup
);
AuthRouter.route("/signin").post(signin);

export default AuthRouter;
