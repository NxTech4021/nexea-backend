import { Request, Response } from 'express';
import { prisma } from '@configs/prisma';
import bcrypt from 'bcrypt';

//add new user

const getUser = async (req: Request, res: Response) => {
    const allUsers = await prisma.users()
    res.send(JSON.stringify({"status": 200, "error": null, 'response': allUsers}));
  }

const createUser =  async (req: Request, res: Response) => {
    
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
        return res.status(404).json({
            error: error.message, 
        });
    }
};

export = { getUser , createUser};
