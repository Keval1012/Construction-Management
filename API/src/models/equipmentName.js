import mongoose from 'mongoose';

const equipmentNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// equipmentNameSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("EquipmentName", equipmentNameSchema, "equipmentName")