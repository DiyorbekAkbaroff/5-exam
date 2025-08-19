import jwt from "jsonwebtoken";
import { serverConfig } from "../config.js";
export const jwtService = {
    createToken: (payload) =>  jwt.sign(payload, serverConfig.token_key, {expiresIn: "20d"}),
    verifyToken: (token) => jwt.verify(token, serverConfig.token_key)
}