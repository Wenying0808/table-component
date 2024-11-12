import mongoose, { Schema } from "mongoose";

interface ITable2AppAnalysis {
    id: string;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number;
}

interface ITable2Document extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number;
    user: string;
    appAnalyses: ITable2AppAnalysis[];
}

const table2AppAnalysisSchema: Schema<ITable2AppAnalysis> = new Schema({
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

const table2Schema: Schema<ITable2Document> = new Schema({
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
        type: [table2AppAnalysisSchema],
        required: true,
    },
});

const Table2Model = mongoose.models.Table2 || mongoose.model<ITable2Document>('Table2', table2Schema);

export default Table2Model;
