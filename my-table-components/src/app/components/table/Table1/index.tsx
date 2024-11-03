import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getSortedRowModel, SortingState } from '@tanstack/react-table'
import table1Data from '../../../data/MockData_Table1.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { TableColumnHeaderRow } from '../TableColumnHeaderRow';
import ColumHeader from '../ColumneHeader';
import { TableCellStatus } from '../StatusCell';
import { Table1Row } from '../Table1Row';
import { BaseAnalysis } from '@/app/types/DataTypes';


const columnHelper = createColumnHelper<BaseAnalysis>();

export default function Table1() {
   
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(['id', 'name', 'user', 'status', 'duration']); 
    const [sorting, setSorting] = useState<SortingState>([ {id: 'id', desc: true} ]);

    useEffect(() => {
        setData(table1Data as BaseAnalysis[]);
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumHeader 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    Id
                </ColumHeader>
            ),
            sortingFn: 'alphanumeric',
            sortDescFirst: true,
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumHeader 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    Name
                </ColumHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
        columnHelper.accessor('duration', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumHeader 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    Duration
                </ColumHeader>
            ),
            sortingFn: 'alphanumeric'
        }),
        columnHelper.accessor('status', {
            cell: info => <TableCellStatus data={info.getValue()} />,
            header: ({ column }) => (
                <ColumHeader 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    Status
                </ColumHeader>
            ),
            sortingFn: 'alphanumeric'
        }),
        columnHelper.accessor('user', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumHeader 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    onClick={() => {
                        column.toggleSorting();
                    }}
                >
                    User
                </ColumHeader>
            ),
            sortingFn: 'alphanumeric',
        }),
    ], []);

    const table = useReactTable({ 
        columns,
        data,
        state:{
            columnOrder,
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setColumnOrder,
        onSortingChange: setSorting,
    });

    console.log('table1 sorting state:', table.getState().sorting);

    const tableStyles = {
        padding: " 10px 20px",
    }

    return (
        <div className="table1">
            <table style={tableStyles}>
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
                        <Table1Row key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext())}
                                </td>
                            ))}
                        </Table1Row>
                    ))}
                </tbody>
            </table>
        </div>
    )
}