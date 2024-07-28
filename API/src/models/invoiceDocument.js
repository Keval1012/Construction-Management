import mongoose from 'mongoose';

const invoiceDocumentSchema = new mongoose.Schema({
    saleInvoiceId: {
        type: String,
        required: false,
    },
    purchaseOrderId: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    attachment: {
        type: String,
        required: [true, 'Attachment is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// invoiceDocumentSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("InvoiceDocument", invoiceDocumentSchema, "invoiceDocument")