import { dataUri } from "./config/multer.config";
import { uploader } from "./config/cloudinary.config";

export default async function ProductUpload(req, res, next) {
	console.log(req.body);
	console.log(req.file);
	if (req.file) {
		let images;
		try {
			const file = dataUri(req).content;
			const result = await uploader.upload(file);
			console.log(result);
			images = { img: result.url, public_id: result.public_id };
		} catch (error) {
			console.log(error);
			return res.status(422).send({ error: "error ocurred in image upload" });
		}
		console.log(images);
		req.images = images;
		next();
	} else {
		return res.status(422).send({ error: "image required" });
	}
}
