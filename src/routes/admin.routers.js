import express from "express";
import {
  adminLogin,
  createAdmin,
  createMembershipPlan,
  createUser,
  getAdminProfile,
  getListOfUsers,
  getUserDetails,
  listOfMembershipPlans,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const adminRouter = express.Router();

adminRouter.post("/create-admin", createAdmin);
adminRouter.post("/admin-login", adminLogin);
adminRouter.post(
  "/create-membership-plan",
  authMiddleware,
  createMembershipPlan,
);
adminRouter.get(
  "/list-of-membership-plans",
  authMiddleware,
  listOfMembershipPlans,
);
adminRouter.post("/create-user", authMiddleware, createUser);
adminRouter.post("/get-list-of-users", authMiddleware, getListOfUsers);
adminRouter.post("/get-user-details", authMiddleware, getUserDetails);
adminRouter.get("/get-admin-profile", authMiddleware, getAdminProfile);
