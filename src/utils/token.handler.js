import jwt from "jsonwebtoken";

export const createToken = (tokenPayload) => {
  return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
};
