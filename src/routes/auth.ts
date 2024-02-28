import { prisma } from '@configs/prisma';
import express, { Request, Response} from 'express';


//const bcrypt = require('bcrypt');
//const prisma = require('@prisma/client');
// import bycrypt 







const app = express();
app.use(express.json()); 


app.post('/register', async (req: Request, res: Response) => {
    try {
        // Hash the password
        const saltRounds =  10; // You can adjust the salt rounds as needed
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create the new user with the hashed password
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        return res.json({
            message: `${req.body.username} account has been created`,
        });
    } catch (error) {
        return res.json({
            error: error.message, // It's a good practice to send only the error message
        });
    }
});

// Login 

app.post ('/login' , async ( req : Request, res: Response) => {
    try {
        const User = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })


})


// Forgot password 

app.post('/forgot-password', async (req: express.Request, res: express.Response) => {
    try {
        const getUser = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (getUser != null) {
            //const token = await genHash(RESET_BYTES)
            const addResetToken = await prisma.user.update({
                where: {
                    email: req.body.email
                },
                data: {
                    resetPass: token,
                    resetExp: new Date(Date.now() + MINUTES * 60000).valueOf()
                }
            })
            return res.json({
                resetPasswordToken: token,
                resetPasswordExpiration: new Date(Date.now() + MINUTES * 60000).valueOf(),
                tokenExpiresIn: `${MINUTES} minutes`,
                urlSentToEmail: `${SITE}/reset-password/${token.toString()}`
            })
        }
        else {
            return res.status(400).json({
                message: "Email doesn't exist"
            })
        }


    }
    catch (e) {
        return res.status(500).json({
            msg: e
        })
    }



})

// reset-password 

app.post('/reset-password/:token', async (req: express.Request, res: express.Response) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                resetPass: req.params.token
            }
        })
        const now = new Date(Date.now()).valueOf()

        if (user?.resetExp) {
            if (user.resetExp > now) {
                const hashed: any = await hashPw (req.body.password)
                const addResetToken = await prisma.user.update({
                    where: {
                        email: user.email
                    },
                    data: {
                        password: hashed,
                        resetExp: 0,
                        resetPass: ""
                    }
                })

                return res.json({
                    expiration: user.resetExp,
                    now: now,
                    expiredToken: user.resetExp > now ? true : false,
                    message: `${user.username} account password has been reset`

                })
            }
            else {

                const addResetToken = await prisma.user.update({
                    where: {
                        email: user.email
                    },
                    data: {
                        resetExp: 0,
                        resetPass: ""
                    }
                })

                return res.json({
                    message: "Reset password has expired. Please try again if needed.",
                    expiredToken: user.resetExp > now ? true : false,
                    expiration: user.resetExp,
                    now: now
                })
            }

        }
        else {
            return res.json({
                message: `Are you trying to reset your password? Visit ${SITE}/forgot-password to reset your password`,
            })
        }


    }
    catch (e) {
        return res.status(500).json({
            message: "Something went wrong please try again"
        })
    }


})


export const hashPw = async (pw: string) => {

    try {
        const hash = await ag.hash(pw)
        return hash
    }
    catch (err) {
        return err
    }
}

