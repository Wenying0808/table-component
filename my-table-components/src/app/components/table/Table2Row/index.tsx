import { TableRowProps, ExpandableRow } from '@/app/types/TableTypes';
import { colors } from '@/app/styles/colors';

export const Table2Row = <T extends ExpandableRow>({ row, children }: TableRowProps<T>) => {
    const rowStyles = {
        parentRow: {
            fontSize: "14px",
            fontWeight: 600,
            borderTop: `1px solid ${colors.gallery}`,
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