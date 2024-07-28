import mongoose from 'mongoose';

const equipmentRequestSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    taskId: {
        type: String,
        required: [true, 'TaskId is required'],
    },
    equipmentId: {
        type: String,
        required: [true, 'EquipmentId is required'],
    },
    quantity: {
        type: String,
        required: [true, 'Quantity is required'],
    },
    requester: {
        type: String,
        required: [true, 'Requester is required'],
    },
    fromDate: {
        type: Date,
        required: [true, 'From Date is required'],
    },
    toDate: {
        type: Date,
        required: [true, 'To Date is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    approvedBy: {
        type: String,
        required: false,
    },
    approvedTime: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['pending', 'approved', 'rejected', 'returned']
    },
    attachment: {
        type: Array,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// equipmentRequestSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("EquipmentRequest", equipmentRequestSchema, "equipmentRequest")