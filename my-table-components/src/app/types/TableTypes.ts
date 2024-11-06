import { Row, VisibilityState } from '@tanstack/react-table';

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
    id: string;
    children: React.ReactNode;
    isSortable?: boolean;
    sortingState?: SortingDirection;
    columnIsRemoveable?: boolean;
    handleSorting?: () => void;
    handleRemoveColumn?: () => void;
};

export interface ColumnHeaderAddProps {
    onClick: () => void;
}

export interface ColumnOption {
    value: string;
    label: string;
}

export interface AddColumnModalProps {
    open: boolean;
    onClose: () => void;
    columnOptions: ColumnOption[];
    onAddColumns: (columns: ColumnOption[]) => void;
}

export interface TableColumnsManagementProps {
    initialColumnOrder: string[];
    initialColumnVisibility: VisibilityState;
}
