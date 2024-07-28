import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    inspectionType: {
        type: String,
        required: [true, 'Type is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    inspectionDate: {
        type: Date,
        required: [true, 'Inspection Date is required'],
    },
    inspector: {
        type: String,
        required: [true, 'Inspector is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['active', 'completed'],
    },
    document: {
        type: Array,
        required: [true, 'Document is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// inspectionSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Inspection", inspectionSchema, "inspection")