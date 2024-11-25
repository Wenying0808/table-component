import { colors } from "../../../styles/colors";

export const TableCellStatus = ({ data }: { data: string }) => {

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return colors.salem;
            case 'failed':
                return colors.alizarin;
            case 'running':
                return colors.scooter;
            case 'queued':
                return colors.moodyBlue;
            default:
                return colors.black; 
        }
    };

    const cellStyles = {
        color: getStatusColor(data),
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    }

    return (
        < div style={cellStyles}>{data}</div>
    )
};