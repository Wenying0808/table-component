import { useState, useEffect, useMemo } from "react";
import { AppTaskAnalysis, TaskAnalysis, WorkflowTaskAnalysis } from "../../../types/DataTypes";
import table3Data from "../../../data/MockData_Table3.json";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { TableColumnHeaderRow } from "../TableColumnHeaderRow";
import ColumnHeader from "../ColumnHeader";
import { Table3Row } from "../Table3Row";
import { Table3CellExpand } from "../Table3CellExpand";
import React from "react";
import { TableCellActions } from "../ActionsCell";
import { TableCellStatus } from "../StatusCell";

export default function Table3() {
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const columnHelper = createColumnHelper<WorkflowTaskAnalysis>();

    useEffect(() => {
        setData(table3Data as WorkflowTaskAnalysis[]);
    }, []);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table3CellExpand row={row} />,
            header: () => <span className="table-header"></span>
        }),
        columnHelper.accessor('id', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                >
                    Id
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    handleSorting={() => {
                        column.toggleSorting();
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
                    handleSorting={() => {
                        column.toggleSorting();
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
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                >
                    Duration
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
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
        },
        onSortingChange: setSorting,
    })

    return (
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
    );
}