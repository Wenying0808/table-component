import { TableRowProps, ExpandableRow } from '../../../types/TableTypes';
import { colors } from '../../../styles/colors';

export const Table2Row = <T extends ExpandableRow>({ row, children }: TableRowProps<T>) => {
    const rowStyles = {
        parentRow: {
            fontSize: "14px",
            fontWeight: 600,
            borderBottom: `1px solid ${colors.alto}`,
            height: "46px",
        },
        childRow: {
            fontSize: "13px",
            fontWeight: 500,
            backgroundColor: `${colors.wildSand}`,
            height: "34px",
        },
    };

    return (
        <tr style={row.depth === 0 ? rowStyles.parentRow : rowStyles.childRow}>
            {children}
        </tr>
    );
};