import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getExpandedRowModel } from '@tanstack/react-table'
import table2Data from '../../../data/MockData_Table2.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';

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


const columnHelper = createColumnHelper<WorkflowAnalysis>();

export default function Table2() {
   
    const [data, setData] = useState<WorkflowAnalysis[]>([]);

    useEffect(() => {
        setData(table2Data as WorkflowAnalysis[]);
    }, []);

    const columns = useMemo(() => [
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
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Status
                </span>
            )
        }),
        columnHelper.accessor('actions', {
            cell: info => info.getValue(),
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
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext())}
                                </td>
                            ))}
                            </tr>
                            {row.getIsExpanded() && (
                                <tr>
                                    <td></td>
                                </tr>
                            )}
                        </React.Fragment> 
                    ))}
                </tbody>
            </table>
        </div>
    )
}