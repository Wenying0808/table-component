import { colors } from '../../styles/colors';

export const TableColumnHeaderRow = ({ children }: { children: React.ReactNode }) => {
    const rowStyles = {
        fontWeight: 700,
        borderBottom: `2px solid ${colors.alto}`,
        height: "46px",
    };

    return (
        <tr style={rowStyles}>
            {children}
        </tr>
    );
};
