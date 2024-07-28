import mongoose from 'mongoose';

const inspectionIssueSchema = new mongoose.Schema({
    inspectionId: {
        type: String,
        required: [true, 'InspectionId is required'],
    },
    inspectionTitle: {
        type: String,
        required: [true, 'InspectionTitle is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    severity: {
        type: String,
        required: [true, 'Severity is required'],
    },
    issueDeadline: {
        type: Date,
        required: [true, 'Issue Deadline is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required']
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// inspectionIssueSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("InspectionIssue", inspectionIssueSchema, "inspectionIssue")