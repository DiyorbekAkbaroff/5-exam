import dotenv from "dotenv";
dotenv.config();
export const serverConfig = {
    PORT: process.env.PORT,
    token_key: process.env.mySecretTokenKey
}