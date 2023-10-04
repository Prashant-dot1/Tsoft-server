import { User } from "@prisma/client";
import { prismaclient } from "../client/db";
import JWT from "jsonwebtoken";

const JWT_SECRET = "JNCI2YR9U23983R0NCXC"
class JWTService {
    public static generateTokenFOrUser(user : User){
        const payload = {
            id:user.id,
            email : user.email
        };

        const token = JWT.sign(payload , JWT_SECRET);
        return token;
    }
}

export default JWTService;