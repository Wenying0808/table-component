import { TableRowProps, ExpandableRow } from '../../../types/TableTypes';
import { colors } from '../../styles/colors';

export const Table3Row = <T extends ExpandableRow>({ row, children }: TableRowProps<T>) => {
    const rowStyles = {
        parentRow: {
            fontSize: "14px",
            fontWeight: 600,
            borderBottom: `1px solid ${colors.alto}`,
            backgroundColor: `${colors.white}`,
            height: "46px",
        },
        childRow: {
            fontSize: "13px",
            fontWeight: 500,
            borderBottom: `1px solid ${colors.alto}`,
            backgroundColor: `${colors.white}`,
            height: "34px",
        },
        grandChildRow: {
            fontSize: "13px",
            fontWeight: 500,
            borderBottom: `1px solid ${colors.alto}`,
            backgroundColor: `${colors.wildSand}`,
            height: "34px",
        },
    };
    const getRowStyles = (depth: number) => {
        switch (depth) {
            case 0: return rowStyles.parentRow;
            case 1: return rowStyles.childRow;
            case 2: return rowStyles.grandChildRow;
        }
    }

    return (
        <tr style={getRowStyles(row.depth)}>
            {children}
        </tr>
    );
};