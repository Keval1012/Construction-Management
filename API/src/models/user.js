import mongoose from 'mongoose';

// const GENDERS = ['male', 'female', 'other'];

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        // required: true,
        required: [true, 'Name is required'],
        min: 3,
        trim: true
    },
    surname: { 
        type: String,
        // required: true,
        required: [true, 'Surname is required'],
        min: 3,
        trim: true
    },
    username: {
        type: String,
        // required: true,
        required: [true, 'Username is required'],
        min: 3,
        trim: true
    },
    builderId: {
        type: String,
        required: false,
        // required: [true, 'Username is required'],
        trim: true
    },
    jobTitle: {
        type: String,
        required: false,
        // required: [true, 'jobTitle is required'],
        trim: true
    },
    mobile: {
        type: String, 
        required: [true, 'Mobile number is required'],
        trim: true
    },
    email: {
        type: String, 
        required: [true, 'Email is required'],
        trim: true
    },
    image: { 
        type: String, 
        required: false 
    },
    password: { 
        type: String, 
        required: false,
        trim: false
    },
    documentUrl: { 
        type: String, 
        required: false 
    },
    status: { 
        type: Boolean, 
        required: false 
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// userSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("User", userSchema, "users")