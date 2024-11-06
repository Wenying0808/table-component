import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getExpandedRowModel, SortingState, getSortedRowModel, VisibilityState } from '@tanstack/react-table'
import table2Data from '../../../data/MockData_Table2.json';
import { WorkflowAnalysis } from '../../../types/DataTypes';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { TableColumnHeaderRow } from '../TableColumnHeaderRow';
import ColumnHeader from '../ColumnHeader';
import { Table2Row } from '../Table2Row';
import { Table2CellExpand } from '../Table2CellExpand';
import { TableCellStatus } from '../../table/StatusCell';
import { TableCellActions } from '../../table/ActionsCell';
import { ColumnHeaderAdd } from '../ColumnHeaderAdd';
import { AddColumnModal } from '../AddColumnModal';
import { ColumnOption } from '@/app/types/TableTypes';


export default function Table2() {
   
    const [data, setData] = useState<WorkflowAnalysis[]>([]);
    const [sorting, setSorting] = useState<SortingState>([ {id: 'id', desc: true} ]);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
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
            header: ({ column}) => (
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
            header: ( {column }) => (
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
        getSubRows: (row: WorkflowAnalysis) => {
            if (row && 'appAnalyses' in row) {
                return row.appAnalyses;
            }
            return undefined;
        },
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
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
            <table className="table2">
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
        </>
    )
}