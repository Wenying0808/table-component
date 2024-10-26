import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getExpandedRowModel } from '@tanstack/react-table'
import table2Data from '../../../data/MockData_Table2.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { TableColumnHeaderRow } from '../TableColumnHeaderRow';
import { Table2Row } from '../Table2Row';
import { Table2CellExpand } from '../Table2CellExpand';
import { TableCellStatus } from '../../table/StatusCell';
import { TableCellActions } from '../../table/ActionsCell';



type BaseAnalysis = {
    id: string;
    name: string;
    status: string;
    actions: string[];
    updatedTime: string;
    duration: string;
}

type AppAnalysis = BaseAnalysis;

type WorkflowAnalysis = BaseAnalysis & {
    appAnalyses?: AppAnalysis[];
}




export default function Table2() {
   
    const [data, setData] = useState<WorkflowAnalysis[]>([]);
    const columnHelper = createColumnHelper<WorkflowAnalysis>();

    useEffect(() => {
        setData(table2Data as WorkflowAnalysis[]);
    }, []);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table2CellExpand row={row} />,
            header: () => <span className="table-header"></span>
        }),
        columnHelper.accessor('id', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Id
                </span>
            )
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Name
                </span>
            )
        }),
        columnHelper.accessor('duration', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Duration
                </span>
            )
        }),
        columnHelper.accessor('status', {
            cell: info => <TableCellStatus data={info.getValue()} />,
            header: () => (
                <span className="table-header">
                    Status
                </span>
            )
        }),
        columnHelper.accessor('actions', {
            cell: info => <TableCellActions data={info.getValue()} />,
            header: () => (
                <span className="table-header">
                    Actions
                </span>
            )
        }),
    ], []);

    const table = useReactTable({ 
        columns,
        data,
        getSubRows: (row: WorkflowAnalysis) => {
            if (row && 'appAnalyses' in row) {
                return row.appAnalyses;
            }
            return undefined;
        },
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });


    return (
        <div className="table1">
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
                    </TableColumnHeaderRow>
                ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <Table2Row key={row.id} row={row}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext())}
                                    </td>
                                ))}
                            </Table2Row>
                        </React.Fragment> 
                    ))}
                </tbody>
            </table>
        </div>
    )
}