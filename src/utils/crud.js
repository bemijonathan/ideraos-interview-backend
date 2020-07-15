export const getOne = (model) => async (req, res) => {
	try {
		const doc = await model
			.findOne({ _id: req.params.id })
			.select(" email _id about image name")
			.lean()
			.exec();

		if (!doc) {
			return res.status(400).end();
		}
		let owner = false;
		if (req.user._id.toString() === req.params.id.toString()) owner = true;

		res.status(200).json({ data: { ...doc, owner } });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};

export const getMany = (model) => async (req, res) => {
	try {
		const docs = await model.find().select("name image about").lean().exec();

		res.status(200).json({ data: docs });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};

export const createOne = (model) => async (req, res) => {
	const createdBy = req.user._id;
	try {
		const doc = await model.create({ ...req.body, createdBy });

		res.status(201).json({ data: { ...doc } });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};

export const updateOne = (model) => async (req, res) => {
	const { name, about } = req.body;
	try {
		const updatedDoc = await model
			.findOneAndUpdate(
				{
					_id: req.user._id,
				},
				{ name, about },
				{ new: true }
			)
			.select("email name about image")
			.lean()
			.exec();

		if (!updatedDoc) {
			return res.status(400).end();
		}

		res.status(200).json({ data: { ...updatedDoc, owner: true } });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};

export const removeOne = (model) => async (req, res) => {
	try {
		const removed = await model.deleteOne({
			_id: req.params.id,
		});
		console.log(removed);

		if (!removed) {
			return res.status(400).end({ error: "not removed" });
		}

		return res.status(200).json({ data: removed });
	} catch (e) {
		console.error(e);
		res.status(400).end({ error: "error dey oh" });
	}
};

export const crudControllers = (model) => ({
	removeOne: removeOne(model),
	updateOne: updateOne(model),
	getMany: getMany(model),
	getOne: getOne(model),
	createOne: createOne(model),
});
