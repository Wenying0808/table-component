const getStatusBasedProperties = (status: string) => {
    const randomDuration = Math.floor(Math.random() * 100) + 1; // Random duration between 1-100

    switch (status) {
        case "Queued":
            return {
                actions: ["Stop"],
                duration: null
            };
        case "Running":
            return {
                actions: ["Pause"],
                duration: null
            };
        case "Completed":
            return {
                actions: ["Open", "Report"],
                duration: randomDuration
            };
        case "Failed":
            return {
                actions: ["Report"],
                duration: randomDuration
            };
        default:
            return {
                actions: [],
                duration: null
            };
    }
};


const statusOptions = ["Queued", "Running", "Completed", "Failed"];
const userOptions = ["Paul Smith", "John Doe", "Jane Lin", "Alice Johnson", "Bob Brown"];
export const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
export const statusProps = getStatusBasedProperties(randomStatus);
export const randomUser = userOptions[Math.floor(Math.random() * userOptions.length)];