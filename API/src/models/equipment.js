import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    equipmentName: {
        type: String,
        required: [true, 'Name is required'],
    },
    equipmentType: {
        type: String,
        required: [true, 'Type is required'],
    },
    totalQuantity: {
        type: String,
        required: [true, 'Total Qty is required'],
    },
    manufactureDate: {
        type: Date,
        required: [true, 'Manufacture Date is required'],
    },
    purchaseDate: {
        type: Date,
        required: false,
    },
    purchasePrice: {
        type: String,
        required: false,
    },
    isRental: {
        type: Boolean,
        required: [true, 'isRental is required'],
    },
    rentalPricePerDay: {
        type: String,
        required: false,
    },
    rentalStartDate: {
        type: Date,
        required: false,
    },
    rentalEndDate: {
        type: Date,
        required: false,
    },
    isRentalReturned: {
        type: Boolean,
        required: false,
    },
    currentLocation: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['available', 'inUse', 'maintanance']
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// equipmentSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("Equipment", equipmentSchema, "equipment")