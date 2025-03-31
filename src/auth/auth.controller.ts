import "dotenv/config";
import { Context } from "hono";
import { createAuthUserService, getUserByEmailService, userLoginService } from "./auth.service";
import bycrpt from "bcrypt";
import { sign } from "hono/jwt";


export const registerUser = async (c: Context) => {
    try {
        const user = await c.req.json();
        const email = user.email;
        const userExist = await getUserByEmailService(email);
        if (userExist) return c.json({ error: "User already exist" }, 409);
        const salt = bycrpt.genSaltSync(10);        
        const hashedPassword = bycrpt.hashSync(user.password, salt);
        user.password = hashedPassword;
        const createdUser = await createAuthUserService(user);
        if (!createdUser) return c.text("User not created", 404);
        return c.json({ msg: createdUser }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }

}
export const loginUser = async (c: Context) => {

    try {
        const user = await c.req.json();
        const email = user.email;
        const userExist = await getUserByEmailService(email);
        if (!userExist) return c.json({ error: "User not found" }, 404);  // not found 
        const hashedPassword = userExist?.password;
        const password = user.password;        
        const isMatch = bycrpt.compareSync(password, hashedPassword as string);
        
        if (!isMatch) {
            return c.json({ error: "Invalid credentials" }, 401);  // unauthorized
        } else {
            // create a payload
            const payload = {
                id: userExist?.id,
                user_type: userExist?.user_type,
                full_name: userExist?.full_name,
                email: userExist?.email,
                exp: Math.floor(Date.now() / 1000) + (60 * 180)  // 3 hour  => SESSION EXPIRATION
            }
            let secret = process.env.JWT_SECRET as string;  // secret key
            const token = await sign(payload, secret);   // create a JWT token
            const {password, ...userWithoutPassword} = userExist;
            return c.json({ token, user: userWithoutPassword}, 200);  // return token and user details
        }
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
