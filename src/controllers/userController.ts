// import { Request, Response } from 'express';
// import { getUserFromDatabase } from '../services/index';

// const getUser = async (_req: Request, res: Response) => {
//   const data = await getUserFromDatabase();
//   res.cookie('HA', 'ADWAD', { maxAge: 60000 });
//   res.status(200).json(data);
// };

// export { getUser };

import { userUpdateService } from '@services/userServices';
import { Request, Response } from 'express';

// Function for user to store single input data of attendance into database
export const updateInfo = async (req: Request, res: Response) => {
  try {
    const userUpdateData = req.body;
    const newInfo = await userUpdateService(req, res, userUpdateData);
    return res.status(201).json(newInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error' });
  }
};
