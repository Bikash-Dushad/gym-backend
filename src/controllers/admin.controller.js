import {
  adminDashboardService,
  adminLoginService,
  createAdminService,
  getAdminProfileService,
} from "../services/admin.service.js";
import {
  createMembershipPlanService,
  listOfMemberShipPlansService,
} from "../services/membershipPlans.service.js";
import {
  createUserService,
  getListOfUsersService,
  getUserDetailsService,
} from "../services/user.service.js";
import { handleError } from "../utils/error.handler.js";

export const createAdmin = async (req, res) => {
  try {
    const payload = req.body;
    const data = await createAdminService(payload);
    return res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "createAdmin");
  }
};

export const createMembershipPlan = async (req, res) => {
  try {
    const payload = req.body;
    const data = await createMembershipPlanService(payload);
    return res.status(200).json({
      success: true,
      message: "Membership plan created successfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "createMembershipPlan");
  }
};

export const adminLogin = async (req, res) => {
  try {
    const payload = req.body;
    const data = await adminLoginService(payload);
    res.cookie("adminToken", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successfull",
      data,
    });
  } catch (error) {
    handleError(res, error, "adminLogin");
  }
};

export const listOfMembershipPlans = async (req, res) => {
  try {
    const data = await listOfMemberShipPlansService();
    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "listOfExistingMembershipPlans");
  }
};

export const createUser = async (req, res) => {
  try {
    const payload = req.body;
    const data = await createUserService(payload);
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "createUser");
  }
};

export const getListOfUsers = async (req, res) => {
  try {
    const payload = req.body;
    const data = await getListOfUsersService(payload);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "getListOfUsers");
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = await getUserDetailsService(userId);
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "getUserDetails");
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = await getAdminProfileService(adminId);
    return res.status(200).json({
      success: true,
      message: "Admin Profile fetched successfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "getAdminProfile");
  }
};

export const adminDashboard = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = await adminDashboardService(adminId);
    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched sccessfully",
      data,
    });
  } catch (error) {
    handleError(res, error, "adminDashboard");
  }
};
