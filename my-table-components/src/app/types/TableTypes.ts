import { Row } from '@tanstack/react-table';

export interface ExpandableRow {
    id: string;
}

export interface TableRowProps<T extends ExpandableRow> {
    row: Row<T>;
    children: React.ReactNode;
}

export interface TableCellExpandProps<T extends ExpandableRow> {
    row: Row<T>;
}