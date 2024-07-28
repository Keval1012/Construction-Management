import mongoose from 'mongoose';

const dailyStatusSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    taskId: {
        type: String,
        required: [true, 'TaskId is required'],
    },
    progress: {
        type: String,
        required: [true, 'Progress is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    problemFaced: {
        type: String,
        required: [true, 'Problem is required'],
    },
    reportedBy: {
        type: String,
        required: [true, 'Reported By is required'],
    },
    reportedOn: {
        type: Date,
        required: [true, 'Reported On Date is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// dailyStatusSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("DailyStatus", dailyStatusSchema, "dailyStatus")