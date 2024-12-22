import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';


const acdemicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },

    academicFaculty:{
            type:Schema.Types.ObjectId,
            ref:'AcademicFaculty',
    },
   
  },
  {
    timestamps: true,
  },
);





acdemicDepartmentSchema.pre('save', async function (next) {
     const isDepartmentExist=await AcademicDepartment.findOne({
            name:this.name
     })     
     if(isDepartmentExist){
            throw new AppError(httpStatus.NOT_FOUND,"The Department already exist")
     }

     next()
})


acdemicDepartmentSchema.pre('findOneAndUpdate', async function(next) {
            const query=this.getQuery()
            const isDepartmentExist=await AcademicDepartment.findOne(query);

            if(!isDepartmentExist){
                        throw new AppError(httpStatus.NOT_FOUND,'This Department does not exist')
            }

            next()
})





export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  acdemicDepartmentSchema,
);


