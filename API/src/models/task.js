import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'Name is required'],
    },
    taskNumber: {
        type: String,
        required: false
    },
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    // milestoneId: {
    //     type: String,
    //     required: [true, 'MilestoneId is required'],
    // },
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
    assignTo: {
        type: String,
        required: [true, 'AssignTo is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['notStarted', 'onGoing', 'completed']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['low', 'medium', 'high', 'critical']
    },
    completionPercent: {
        type: String,
        required: [true, 'CompletionPercent is required'],
    },
    attachment: {
        type: String,
        required: false,
        // required: [true, 'Attachments is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// taskSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Task", taskSchema, "task");