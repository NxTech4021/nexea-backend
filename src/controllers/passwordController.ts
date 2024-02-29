import  express, { Request, Response } from 'express';
import { prisma } from '@configs/prisma';
import { createTokens, validateToken} from '../utils/JwtHelper'
import crypto from 'crypto';
import bcrypt from 'bcrypt';


const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(400).json({ error: "User Doesn't Exist" });
        }

        // Generate and set password reset token
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        await prisma.user.update({
            where: { email: email },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });

        // Send the password reset email
        await sendResetEmail(email, token);

        res.json({ message: 'Password reset email has been sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: token },
        });

        if (!user) {
            return res.status(400).json({ error: "Password reset token is invalid or has expired." });
        }

        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ error: "Password reset token has expired." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.json({ message: 'Password has been reset.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while resetting your password" });
    }
};


export = { forgetPassword, resetPassword}