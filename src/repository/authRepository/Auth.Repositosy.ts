import { connect } from "../../config/database";

export async function Auth(email_U:string) {
    try {
        const conn = await connect();
        const result = await conn.query('SELECT password_U FROM Users WHERE email_U = ?',[email_U]);
        return result;
    } catch (error) {
        throw new Error('Incorrect username or password');
    }
}