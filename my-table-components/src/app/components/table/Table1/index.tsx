import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getSortedRowModel, SortingState, RowPinningState } from '@tanstack/react-table'
import table1Data from '../../../data/MockData_Table1.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { TableColumnHeaderRow } from '../TableColumnHeaderRow';
import ColumnHeader from  '../ColumnHeader';
import { TableCellStatus } from '../StatusCell';
import { Table1Row } from '../Table1Row';
import { BaseAnalysis } from '@/app/types/DataTypes';
import { TableCellActions } from '../ActionsCell';
import { ColumnHeaderAdd } from '../ColumnHeaderAdd';
import { AddColumnModal } from '../AddColumnModal';
import { ColumnOption } from '@/app/types/TableTypes';


const columnHelper = createColumnHelper<BaseAnalysis>();

export default function Table1() {
   
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(['id', 'name', 'user', 'status', 'duration', 'actions', 'add']); 
    const [sorting, setSorting] = useState<SortingState>([ 
        { id: 'id', desc: true } 
    ]);
    const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
        top: [''],
        bottom: [],
    })
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState({
        'id': true,
        'name': false,
        'user': true,
        'status': true,
        'duration': true,
        'actions': true,
        'add': true,
    });


    const availableColumns = useMemo(() => {
        return [
                { value: 'id', label: 'Id' },
                { value: 'name', label: 'Name' },
                { value: 'user', label: 'User' },
                { value: 'status', label: 'Status' },
                { value: 'duration', label: 'Duration' },
                { value: 'actions', label: 'Actions' }
        ].filter(column => !columnVisibility[column.value as keyof typeof columnVisibility]);
    }, [columnVisibility]);

    useEffect(() => {
        setData(table1Data as BaseAnalysis[]);
    }, []);

    const columns = useMemo(() => [
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
            sortingFn: 'alphanumeric'
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
            sortingFn: 'alphanumeric'
        }),
        columnHelper.accessor('user', {
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
                    User
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
    ], []);

    const table = useReactTable({ 
        columns,
        data,
        state:{
            columnOrder,
            sorting,
            rowPinning,
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setColumnOrder,
        onSortingChange: setSorting,
        onRowPinningChange: setRowPinning,
        onColumnVisibilityChange: setColumnVisibility,
    });

    console.log('table1 sorting state:', table.getState().sorting);

    const handleAddColumns = (columns: ColumnOption[]) => {
        setColumnVisibility(prev => ({
            ...prev,
            ...Object.fromEntries(columns.map(column => [column.value, true]))
        }));
        console.log('columnVisibility', columnVisibility);
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
            <table className="table1">
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
        </>
    )
}