import { userRouter } from "./user.routes.js";
import { adminRouter } from "./admin.routers.js";

export const routes = [
  { path: "/user", router: userRouter },
  { path: "/admin", router: adminRouter },
];
