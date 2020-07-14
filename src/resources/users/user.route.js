import { Router } from "express";
import controller from "./users.controllers";

const userRoute = Router();

userRoute.route("/").get(controller.getMany);

userRoute
  .route("id")
  .patch(controller.updateOne)
  .delete(controller.removeOne)
  .get(controller.getOne);

export default userRoute;
