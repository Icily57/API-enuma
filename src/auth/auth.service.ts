import { TIUser, TSUser, UsersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq, sql } from "drizzle-orm";

// interface TLogin{
//     user_id: number;
//     password: string;
//     user: {
//         full_name: string;
//         email: string;
//         address: string | null;
//         role: string | null;
//     }[];

// }

export const createAuthUserService = async (user: TIUser): Promise<string | null> => {
    await db.insert(UsersTable).values(user)
    return "User created successfully";
}
export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({     
        where: eq(UsersTable.email, email)
})
}

export const userLoginService = async (user: TSUser) => {
    const { email, password } = user;
    return await db.query.UsersTable.findFirst({
        columns:{
            id: true,
            password: true,
            email: true,
            user_type: true,
            full_name: true,
            contact_phone: true,
        },
        where: sql `${UsersTable.email} = ${email}`,
})
}