import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    displayName: {
        type: String,
        required: [true, 'Display Name is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// roleSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Role", roleSchema, "role")