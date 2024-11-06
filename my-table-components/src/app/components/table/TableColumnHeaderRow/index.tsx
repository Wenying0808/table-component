export const TableColumnHeaderRow = ({ children }: { children: React.ReactNode }) => {
    const rowStyles = {
        fontWeight: 700,
        height: "46px",
    };

    return (
        <tr style={rowStyles}>
            {children}
        </tr>
    );
};
