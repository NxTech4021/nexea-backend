// import { Request, Response } from 'express';
// import { prisma } from '@configs/prisma';
// import bcrypt from 'bcrypt';
// import { registerService } from '@services/authService';

//add new user

// export const getUser = async (req: Request, res: Response) => {
//   console.log(req.query);
//   const allUsers = await prisma.user();
//   res.send(JSON.stringify({ status: 200, error: null, response: allUsers }));
// };


// export const registerUser = async ( req: Request,  res: Response) => {
//   try {
//     const register = await registerService 

//     return register
    
//   } catch (error) {
//         return res.status(404).json({
//           error: (error as any).message,
//         });
//       }
      

// }

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     // Hash the password
//     const saltRounds = 10; // You can adjust the salt rounds as needed
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     // Create the new user with the hashed password
//     const newUser = await prisma.user.create({
//       data: {
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword,
//       },
//     });
//     console.log(newUser);

//     return res.json({
//       message: `${req.body.name} account has been created`,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       error: (error as any).message,
//     });
//   }
// };
