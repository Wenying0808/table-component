import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from '@tanstack/react-table'
import table1Data from '../../../data/MockData_Table1.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';

type Analysis = {
    id: string;
    name: string;
    duration: number;
    status: string;
    user: string;
}
const columnHelper = createColumnHelper<Analysis>();

export default function Table1() {
   
    const [data, setData] = useState<Analysis[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(['id', 'name', 'user', 'status', 'duration']); 
    useEffect(() => {
        setData(table1Data as Analysis[]);
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
        columnHelper.accessor('user', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    User
                </span>
            )
        }),
    ], []);

    const table = useReactTable({ 
        columns,
        data,
        state:{
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
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
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}