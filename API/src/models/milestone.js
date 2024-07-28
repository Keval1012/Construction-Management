import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    milestoneName: {
        type: String,
        required: [true, 'Name is required'],
    },
    milestoneNumber: {
        type: String,
        required: false
    },
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End Date is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['notStarted', 'onGoing', 'completed']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    progress: {
        type: String,
        required: [true, 'Progress is required'],
    },
    dependencies: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// milestoneSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Milestone", milestoneSchema, "milestone");