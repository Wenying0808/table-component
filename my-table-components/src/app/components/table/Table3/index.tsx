import { useState, useEffect, useMemo } from "react";
import { AppTaskAnalysis, TaskAnalysis, WorkflowTaskAnalysis } from "../../../types/DataTypes";
import table3Data from "../../../data/MockData_Table3.json";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";
import { TableColumnHeaderRow } from "../TableColumnHeaderRow";
import { Table3Row } from "../Table3Row";
import { Table3CellExpand } from "../Table3CellExpand";
import React from "react";
import { TableCellActions } from "../ActionsCell";
import { TableCellStatus } from "../StatusCell";

export default function Table3() {
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
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
            header: 'Id',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => <TableCellStatus data={info.getValue()} />,
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: info => <TableCellActions data={info.getValue()} />,
        }),
        columnHelper.accessor('duration', {
            header: 'Duration',
            cell: info => info.getValue(),
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
    })

    return (
        <table>
            <thead>
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