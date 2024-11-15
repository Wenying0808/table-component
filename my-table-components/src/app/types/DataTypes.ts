export type BaseAnalysis = {
    _id?: string; // for MongoDB
    id?: string;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number | "";
    user?: string;
}

// Table 2 - level 2: app
type AppAnalysis = BaseAnalysis;

// Table 2 - level 1: workflow
export type WorkflowAnalysis = BaseAnalysis & {
    appAnalyses?: AppAnalysis[];
}

// Table 3 - level 3: tasks
export type TaskAnalysis = BaseAnalysis;

// Table 3 - level 2: app
export type AppTaskAnalysis = BaseAnalysis & {
    tasks?: TaskAnalysis[];
};
// Table 3 - level 1: workflow
export type WorkflowTaskAnalysis = BaseAnalysis & {
    appAnalyses?: AppTaskAnalysis[];
}

export interface FilterParams {
    name?: string;
    status?: 'All' | 'Queued' | 'Running' | 'Completed' | 'Failed';
    user?: string;
    date?: string;
}

// used for MongoDB queries in the API
export interface MongoTableDataQuery {
    name?: { $regex: string; $options: string };
    status?: 'All' | 'Queued' | 'Running' | 'Completed' | 'Failed';
    user?: string;
    /*date?: {
        $gte?: Date;
        $lte?: Date;
    };*/
}