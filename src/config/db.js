import mongoose from "mongoose";

export const dbConnection = () => {
	mongoose.Promise = global.Promise;
	mongoose.connect(
		process.env.ENVIRONMENT === "DEVELOPEMENT"
			? "mongodb://localhost:27017/ideraos"
			: "mongodb+srv://jona:jona@cluster0.lu1m9.mongodb.net/ideraos?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		}
	);
};
