import jwt from "jsonwebtoken";

export const generateAccessToken = (school) => {
    return jwt.sign(
        {
            id:school.school_id,
            code: school.school_code,
            name: school.name,
            email: school.email,
        },
        process.env.TOKEN,
        {
            expiresIn: process.env.EXPIRES_IN ,
        }
    );
};