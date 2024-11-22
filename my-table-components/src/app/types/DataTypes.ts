export type BaseAnalysis = {
    _id?: string; // for MongoDB
    id?: string;
    name: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
    actions: string[];
    updatedTime: string;
    duration: number | "";
    user?: string;
    isArchived?: boolean;
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

export type StatusFilter = 'All Status' | 'Queued' | 'Running' | 'Completed' | 'Failed';
export type TimeRangeFilter = 'All Time' | 'Today' | 'This Week' | 'This Month';

export interface FilterParams {
    name?: string;
    status?: StatusFilter;
    user?: string;
    timeRange?: string;
    isArchived?: boolean;
}

// used for MongoDB queries in the API
export interface MongoTableDataQuery {
    name?: { $regex: string; $options: string };
    status?: StatusFilter;
    user?: string;
    timeRange?: TimeRangeFilter;
    isArchived?: boolean;
}