export type BaseAnalysis = {
    _id?: string; // for MongoDB
    id?: string;
    name: string;
    status: string;
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
    analyses?: AppTaskAnalysis[];
}