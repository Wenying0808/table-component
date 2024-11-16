import mongoose, { Schema } from "mongoose";
// interface
interface ITable1 extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number; // mins
    user: string;
    isArchived?: boolean;
}
// schema
const table1Schema: Schema<ITable1> = new Schema({  
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    actions: {
        type: [String],
        required: true,
    },
    updatedTime: {
        type: String,
        required: true,
    },  
    duration: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    isArchived: {
        type: Boolean,
        required: false,
    },
});

const Table1Model = mongoose.models.Table1 || mongoose.model<ITable1>('Table1', table1Schema);

export default Table1Model;
