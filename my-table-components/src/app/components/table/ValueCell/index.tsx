import { FC } from "react";
import { ValueCellContainer } from "./styles";

interface Props{
    row: {
        depth: number;
    };
    value: string | number;
    width: string;
}

export const ValueCell: FC<Props>= ({ row, value, width }) => {
    return (
        <ValueCellContainer as="td" depth={row.depth || 0} width={width}>
            <span>{value}</span>
        </ValueCellContainer>
    )
}