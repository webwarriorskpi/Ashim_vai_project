import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';

const createStudentIntoDB = async (payload: TStudent) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // create a user object
    const userData: Partial<TUser> = {};
    userData.password = payload?.password || (config.default_password as string);
    userData.role = 'student';
    userData.email = payload?.email;

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload?.admissionSemester);
    // //set  generated id
    if (!admissionSemester) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admission semester not found');
    }
    userData.id = await generateStudentId(admissionSemester);

    // // create a user
    const newUser = await User.create([userData], { session });
    // //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User Information not found!!')
    }
    // // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    await session.commitTransaction();
    session.endSession();
    return newStudent[0];


  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user, something went wrong');
  }


};

export const UserServices = {
  createStudentIntoDB,
};
