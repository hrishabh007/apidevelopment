const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true
        },
        last_name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true
        },
        profile_pic: {
            type: String,
            default: null
        }
    }
);
const Student = mongoose.model('StudentApiData', studentSchema);
module.exports = Student;
