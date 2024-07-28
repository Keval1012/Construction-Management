import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
    saleInvoiceId: {
        type: String,
        required: [true, 'Sale Invoice Id is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    quantity: {
        type: String,
        required: false,
    },
    hours: {
        type: String,
        required: false,
    },
    unitOrHourPrice: {
        type: String,
        required: [true, 'Unit Price is required'],
    },
    amount: {
        type: String,
        required: [true, 'Amount is required'],
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// saleItemSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("SaleItem", saleItemSchema, "saleItem");