import { dataUri } from "./config/multer.config";
import { uploader } from "./config/cloudinary.config";
import cloudinary from "cloudinary";

export default async function ProductUpload(req, res, next) {
	if (req.file) {
		cloudinary.config({
			cloud_name: "mixed-code",
			api_key: "488385332347382",
			api_secret: "pupPqg0NvxxbfjLZm3yd9zu4Qtk",
		});
		let images;
		try {
			const file = dataUri(req).content;
			const result = await cloudinary.uploader.upload(file);
			images = { img: result.url, public_id: result.public_id };
		} catch (error) {
			console.log(error);
			return res.status(422).send({ error: "error ocurred in image upload" });
		}
		console.log(images);
		req.body.images = images;
		next();
	} else {
		return res.status(422).send({ error: "image required" });
	}
}
