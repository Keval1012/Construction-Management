import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
    roleId: {
        type: String,
        required: [true, 'RoleId is required'],
    },
    userId: {
        type: String,
        required: [true, 'UserId is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// userRoleSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("UserRole", userRoleSchema, "userRole")