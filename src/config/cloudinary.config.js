import cloudinary from "cloudinary";

const cloudinaryConfig = (req, res, next) => {
	cloudinary.v2.config({
		cloud_name: "mixed-code",
		api_key: "488385332347382",
		api_secret: "pupPqg0NvxxbfjLZm3yd9zu4Qtk",
	});
	next();
};

// CLOUD_NAME=mixedcode
// API_KEY=252624857599431
// API_SECRET=2RJ3TC1WS3a4GItCs4cJaBTwJsA

export { cloudinaryConfig };
