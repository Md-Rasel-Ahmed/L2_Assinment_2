import { UserType } from '../models/user.model'; // আপনার ইউজারের নিজস্ব টাইপ/ইন্টারফেসটি ইম্পোর্ট করুন
interface CustomRequest extends Request {
  user?: UserType;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserType; 
    }
  }
}