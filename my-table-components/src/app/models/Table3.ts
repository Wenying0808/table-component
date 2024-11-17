import mongoose, { Schema } from "mongoose";

interface ITable3TaskAnalysis {
    id: string;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number;
}
interface ITable3AppAnalysis {
    id: string;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number;
    tasks: ITable3TaskAnalysis[];
}

interface ITable3Document extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number;
    user: string;
    appAnalyses: ITable3AppAnalysis[];
}

const table3TaskAnalysisSchema: Schema<ITable3TaskAnalysis> = new Schema({
    id: {
        type: String,
        required: true,
    },
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
});

const table3AppAnalysisSchema: Schema<ITable3AppAnalysis> = new Schema({
    id: {
        type: String,
        required: true,
    },
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
    tasks: {
        type: [table3TaskAnalysisSchema],
        required: true,
    },
}); 

const table3Schema: Schema<ITable3Document> = new Schema({
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
    },
    appAnalyses: {
        type: [table3AppAnalysisSchema],
        required: true,
    },
});

const Table3Model = mongoose.models.Table3 || mongoose.model<ITable3Document>('Table3', table3Schema);

export default Table3Model;
