import mongoose from 'mongoose';

const accessPermissionSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    roleId: {
        type: String,
        required: [true, 'Role id is required']
    },
    isGranted: {
        type: Boolean,
        required: [true, 'isGranted is required']
    }
}, { timestamps: true });

// accessPermissionSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("AccessPermission", accessPermissionSchema, "accessPermission")