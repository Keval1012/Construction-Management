import mongoose from 'mongoose';

const projectDocumentSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: [true, 'Project Id is required'],
    },
    taskId: {
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

// projectDocumentSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("ProjectDocument", projectDocumentSchema, "projectDocument")