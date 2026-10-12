import { Router } from "express";
import { CreateAuthController } from "./controller/auth/createAuthController";
import { AuthController } from "./controller/auth/authController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controller/category/createCategoryController";
import { ListCategoryController } from "./controller/category/listCategoryController";
import { CategoryController } from "./controller/category/categoryController";
import { UpdateCategoryController } from "./controller/category/updateCategoryController";
import { deleteCategoryController } from "./controller/category/deleteCategoryController";
import { createExerciseController } from "./controller/exercise/createExerciseController";
import { UpdateExerciseController } from "./controller/exercise/updateExerciseController";
import { DeleteExerciseController } from "./controller/exercise/deleteExerciseController";
import { CreateSubscriptionController } from "./controller/subscription/createSubscriptionController";
import { GetSubscriptionController } from "./controller/subscription/getSubscriptionController";
import { UpdateSubscriptionController } from "./controller/subscription/updateSubscriptionController";
import { DeleteSubscriptionController } from "./controller/subscription/deleteSubscriptionController";
import { UpdateAuthController } from "./controller/auth/updateAuthController";

export const route = Router();

route.post("/register", new CreateAuthController().handle);
route.post("/login", new AuthController().handle);
route.get("/details", isAuthenticated, new AuthController().handle);
route.put("/auth", isAuthenticated, new UpdateAuthController().handle)

route.post("/category", isAuthenticated, new CreateCategoryController().handle);
route.get("/category/:id", isAuthenticated, new ListCategoryController().handle);
route.get("/category", isAuthenticated, new CategoryController().handle);
route.put("/category/:id", isAuthenticated, new UpdateCategoryController().handle);
route.delete("/category/:id", isAuthenticated, new deleteCategoryController().handle);

route.post("/exercise", isAuthenticated, new createExerciseController().handle);
route.patch("/exercise/:id", isAuthenticated, new UpdateExerciseController().handle);
route.delete("/exercise/:id", isAuthenticated, new DeleteExerciseController().handle);

route.post("/subscription", isAuthenticated, new CreateSubscriptionController().handle);
route.get("/subscription", isAuthenticated, new GetSubscriptionController().handle);
route.put("/subscription/:id", isAuthenticated, new UpdateSubscriptionController().handle);
route.delete("/subscription/:id", isAuthenticated, new DeleteSubscriptionController().handle);
