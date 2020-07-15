import { Router } from "express";
import { protect } from "../../utils/auth";
import controller from "./users.controllers";

const router = Router();

router
	.route("/")
	.get(controller.getMany)
	.patch(protect, controller.updateOne)
	.delete(protect, controller.removeOne);

router.route("/:id").get(protect, controller.getOne);

export default router;
