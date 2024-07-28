import mongoose from 'mongoose';

const saleInvoiceSchema = new mongoose.Schema({
    saleInvoiceNumber: {
        type: String,
        required: false
    },
    projectId: {
        type: String,
        required: [true, 'ProjectId is required'],
    },
    invoiceDate: {
        type: Date,
        required: [true, 'Invoice Date is required'],
    },
    expireDate: {
        type: Date,
        required: [true, 'Expire Date is required'],
    },
    workStartDate: {
        type: Date,
        required: false,
    },
    workEndDate: {
        type: Date,
        required: false,
    },
    amountPaid: {
        type: String,
        required: false,
    },
    materialTax: {
        type: String,
        required: [true, 'Material Tax is required'],
    },
    laborTax: {
        type: String,
        required: [true, 'Labor Tax is required'],
    },
    totalTax: {
        type: String,
        required: [true, 'Total Tax is required'],
    },
    laborAmount: {
        type: String,
        required: [true, 'Amount is required'],
    },
    materialAmount: {
        type: String,
        required: [true, 'Amount is required'],
    },
    totalAmount: {
        type: String,
        required: [true, 'Amount is required'],
    },
    contractorName: {
        type: String,
        required: [true, 'Contractor detail is required'],
    },
    contractorAddress: {
        type: String,
        required: [true, 'Contractor detail is required'],
    },
    companyName: {
        type: String,
        required: [true, 'Company detail is required'],
    },
    companyAddress: {
        type: String,
        required: [true, 'Company detail is required'],
    },
    status: {
        type: String,
        required: false,
        // required: [true, 'Status is required'],
        enum: ['pending', 'approved', 'closed']
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// saleInvoiceSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("SaleInvoice", saleInvoiceSchema, "saleInvoice");