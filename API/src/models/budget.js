import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    budgetName: {
        type: String,
        required: [true, 'Name is required'],
    },
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    totalAmount: {
        type: String,
        required: [true, 'Total Amount is required'],
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
        enum: ['draft', 'approved', 'closed']
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// budgetSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Budget", budgetSchema, "budget");