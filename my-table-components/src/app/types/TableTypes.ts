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

export type SortingDirection = 'asc' | 'desc' | false | undefined;

export interface TableColumnHeaderProps {
    children: React.ReactNode;
    isSortable?: boolean;
    sortingState?: SortingDirection;
    onClick?: () => void;
};

export interface ColumnHeaderAddProps {
    onClick: () => void;
}

export interface AddColumnModalProps {
    open: boolean;
    onClose: () => void;
    columnOptions: { value: string; label: string }[];
}
