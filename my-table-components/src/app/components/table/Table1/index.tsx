import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from '@tanstack/react-table'
import table1Data from '../../../data/MockData_Table1.json';
import { useMemo } from 'react';

type Analysis = {
    id: string;
    name: string;
    duration: number;
    status: string;
    user: string;
}

export default function Table1() {
    const columnHelper = createColumnHelper<Analysis>();
    const data = useMemo(() => table1Data, []);
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Duration',
            accessorKey: 'duration',
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'User',
            accessorKey: 'user',
        },
    ], []);

    const table = useReactTable({ 
        data, 
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="table1">
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} style={{ width: "200px" }}>
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
                                <td key={cell.id} style={{ width: "200px" }}>
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