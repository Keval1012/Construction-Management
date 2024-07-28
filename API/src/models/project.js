import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Name is required'],
    },
    projectNumber: {
        type: String,
        required: false,
        // required: [true, 'Number is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    constructionType: {
        type: String,
        required: [true, 'ConstructionType is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
    },
    completionDate: {
        type: Date,
        required: [true, 'Completion Date is required'],
    },
    builder: {
        type: String,
        required: [true, 'Builder is required'],
    },
    clientName: {
        type: String,
        required: [true, 'Client is required'],
    },
    clientNumber: {
        type: String,
        required: [true, 'Client Number is required'],
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['notStarted', 'onGoing', 'completed']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['low', 'medium', 'high']
    },
    attachment: {
        type: Array,
        required: false,
        // required: [true, 'Attachments is required'],
    },
    estimatedBudget: {
        type: String,
        required: false,
        // required: [true, 'Budget is required'],
    },
    tax: {
        type: String,
        required: false,
        // required: [true, 'tax is required'],
    },
    receivedAmount: {
        type: String,
        required: false,
        // required: [true, 'ReceivedAmount is required'],
    },
    projectValue: {
        type: String,
        required: false,
    },
    completionPercentage: {
        type: String,
        required: [true, 'Percentage is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// projectSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Project", projectSchema, "project")