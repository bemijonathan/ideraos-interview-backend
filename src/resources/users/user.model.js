import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		image: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		about: {
			required: true,
			type: String,
			trim: true,
			minlength: 20,
		},
		token: {
			recoveryToken: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	bcrypt.hash(this.password, 8, (err, hash) => {
		if (err) {
			return next(err);
		}
		this.password = hash;
		next();
	});
});

userSchema.methods.checkPassword = function (password) {
	const passwordHash = this.password;
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, passwordHash, (err, same) => {
			if (err) {
				return reject(err);
			}
			resolve(same);
		});
	});
};

userSchema.methods.newPassword = async function (password) {
	return await bcrypt.hash(password, 10);
};

export const User = mongoose.model("user", userSchema);
