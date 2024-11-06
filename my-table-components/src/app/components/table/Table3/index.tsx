import { useState, useEffect, useMemo } from "react";
import { AppTaskAnalysis, TaskAnalysis, WorkflowTaskAnalysis } from "../../../types/DataTypes";
import table3Data from "../../../data/MockData_Table3.json";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { TableColumnHeaderRow } from "../TableColumnHeaderRow";
import ColumnHeader from "../ColumnHeader";
import { Table3Row } from "../Table3Row";
import { Table3CellExpand } from "../Table3CellExpand";
import React from "react";
import { TableCellActions } from "../ActionsCell";
import { TableCellStatus } from "../StatusCell";
import { ColumnHeaderAdd } from "../ColumnHeaderAdd";
import { AddColumnModal } from "../AddColumnModal";
import { ColumnOption } from "@/app/types/TableTypes";

export default function Table3() {
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        'expand': true,
        'id': true,
        'name': false,
        'status': true,
        'duration': true,
        'actions': true,
        'add': true,
    });
    const availableColumns = useMemo(() => {
        return [
                { value: 'actions', label: 'Actions' },
                { value: 'duration', label: 'Duration' },
                { value: 'id', label: 'Id' },
                { value: 'name', label: 'Name' },
                { value: 'status', label: 'Status' },
        ].filter(column => !columnVisibility[column.value as keyof typeof columnVisibility]);
    }, [columnVisibility]);

    const columnHelper = createColumnHelper<WorkflowTaskAnalysis>();

    useEffect(() => {
        setData(table3Data as WorkflowTaskAnalysis[]);
    }, []);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table3CellExpand row={row} />,
            header: () => <span className="table-header"></span>,
            enableHiding: false,
        }),
        columnHelper.accessor('id', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={false}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                >
                    Id
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
            enableHiding: false,
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={true}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                    handleRemoveColumn={() => {
                        column.toggleVisibility(false);
                    }}
                >
                    Name
                </ColumnHeader>
            ),  
            sortingFn: 'alphanumeric',
        }),
        columnHelper.accessor('status', {
            cell: info => <TableCellStatus data={info.getValue()} />,
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true}
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={true}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                    handleRemoveColumn={() => {
                        column.toggleVisibility(false);
                    }}
                >
                    Status
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
        columnHelper.accessor('actions', {
            cell: info => <TableCellActions data={info.getValue()} />,
            header: () => (
                <ColumnHeader 
                    isSortable={false}
                    columnIsRemoveable={false}
                >
                    Actions
                </ColumnHeader>
            )
        }),
        columnHelper.accessor('duration', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true}
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={true}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                    handleRemoveColumn={() => {
                        column.toggleVisibility(false);
                    }}
                >
                    Duration
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
        columnHelper.display({
            id: 'add',
            cell: () => "",
            header: () => (
                <ColumnHeaderAdd 
                    onClick={() => setIsAddColumnModalOpen(true)} 
                />
            ),
            enableHiding: false,
        })
    ], [])

    type Table3RowData = WorkflowTaskAnalysis | AppTaskAnalysis | TaskAnalysis;

    const table = useReactTable({
        columns,
        data,
        getSubRows: (row: Table3RowData) => {
            console.log('getSubRows called with:', row);
            if (row && 'analyses' in row) {
                return row.analyses;
            }
            if ('tasks' in row) {
                return row.tasks;
            }
            return undefined;
        },
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state:{
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
    });

    const handleAddColumns = (columns: ColumnOption[]) => {
        setColumnVisibility(prev => ({
            ...prev,
            ...Object.fromEntries(columns.map(column => [column.value, true]))
        }));
        /*console.log('columnVisibility', columnVisibility);*/
        setIsAddColumnModalOpen(false);
    };

    return (
        <>
            <AddColumnModal 
                open={isAddColumnModalOpen}
                onClose={() => setIsAddColumnModalOpen(false)}
                columnOptions={availableColumns}
                onAddColumns={handleAddColumns}
            />
            <table className="table3">
                <thead className="sticky-column-header">
                {table.getHeaderGroups().map(headerGroup => (
                    <TableColumnHeaderRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                        </TableColumnHeaderRow>))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <Table3Row key={row.id} row={row}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                    )}
                                </td>
                                ))}
                            </Table3Row>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </>
    );
}