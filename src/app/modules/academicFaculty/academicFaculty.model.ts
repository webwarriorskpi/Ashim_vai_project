import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

const acdemicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
   
  },
  {
    timestamps: true,
  },
);


export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  acdemicFacultySchema,
);

// Name Year
//2030 Autumn => Created
// 2031 Autumn
//2030 Autumn => XXX
//2030 Fall => Created



// Autumn 01
// Summar 02
// Fall 03
