import "dotenv/config";
import { verify } from "hono/jwt"
import { Context, Next } from "hono";

//AUTHENTICATION MIDDLEWARE
export const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = await verify(token as string, secret)
        return decoded;
    } catch (error: any) {
        return null
    }
}

//AUTHORIZATION MIDDLEWARE
export const authMiddleware = async (c: Context, next: Next, requiredUser_type: string) => {
    const token = c.req.header("Authorization");

    if (!token) return c.json({ error: "Token not provided 😒" }, 401);

    const decoded = await verifyToken(token, process.env.JWT_SECRET as string);
    console.log(decoded);

    if (!decoded) return c.json({ error: "Invalid token 💀" }, 401);

    if (requiredUser_type === "both") {
        if (decoded.user_type!== "admin" && decoded.user_type !== "user") return c.json({ error: "Unauthorized" }, 401);
        return next();
    }
    return next();
}

export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin")
export const userRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "user")
export const bothRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both")