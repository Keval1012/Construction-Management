import mongoose from 'mongoose';

const modulePermissionSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Name is required'],
        trim: true
    }
}, { timestamps: true });

// modulePermissionSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("ModulePermission", modulePermissionSchema, "modulePermission")