import { TableRowProps, ExpandableRow } from '../../../types/TableTypes';
import { colors } from '../../styles/colors';

export const Table3Row = <T extends ExpandableRow>({ row, children }: TableRowProps<T>) => {
    const rowStyles = {
        parentRow: {
            boxSizing: "border-box",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: `${colors.white}`,
            height: "46px",
            borderTop: `1px solid ${colors.azure}`,
        },
        childRow: {
            fontSize: "13px",
            fontWeight: 500,
            backgroundColor: `${colors.white}`,
            height: "34px",
        },
        grandChildRow: {
            fontSize: "13px",
            fontWeight: 400,
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