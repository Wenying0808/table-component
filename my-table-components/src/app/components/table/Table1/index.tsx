import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getSortedRowModel, SortingState, VisibilityState } from '@tanstack/react-table'
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
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';




export default function Table1() {
    const columnHelper = createColumnHelper<BaseAnalysis>();
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [sorting, setSorting] = useState<SortingState>([ 
        { id: 'id', desc: true } 
    ]);
    const [columnOrder, setColumnOrder] = useState<string[]>(['id', 'name', 'user', 'status', 'duration', 'actions', 'add']);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        'id': true,
        'name': true,
        'user': false,
        'status': true,
        'duration': false,
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
                { value: 'user', label: 'User' },
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
                    id={column.id}
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
                    id={column.id}
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
                    id={column.id}
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
                    id={column.id}
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
                    id={column.id}
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
            header: ({ column }) => (
                <ColumnHeader 
                    id={column.id}
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
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setColumnOrder,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
    });

    /*console.log('table1 sorting state:', table.getState().sorting);*/

    const handleAddColumns = (columns: ColumnOption[]) => {
        setColumnVisibility(prev => ({
            ...prev,
            ...Object.fromEntries(columns.map(column => [column.value, true]))
        }));
        /*console.log('columnVisibility', columnVisibility);*/
        setColumnOrder(prevOrder => {
            const newColumns = columns.map(column => column.value);
            const initialColumns = prevOrder.filter(column => column !== 'add');
            return [...initialColumns, ...newColumns, "add"];
            
        });
        setIsAddColumnModalOpen(false);
    };

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = columnOrder.indexOf(active.id.toString());
            const newIndex = columnOrder.indexOf(over.id.toString());
            const newColumnOrder = [...columnOrder];
            newColumnOrder.splice(oldIndex, 1);
            newColumnOrder.splice(newIndex, 0, active.id.toString());
            setColumnOrder(newColumnOrder);
        }
    };

    return (
        <>
            <AddColumnModal 
                open={isAddColumnModalOpen} 
                onClose={() => setIsAddColumnModalOpen(false)} 
                columnOptions={availableColumns}
                onAddColumns={handleAddColumns}
            />
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >
                <table className="table1">
                    <thead className="sticky-column-header">
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableColumnHeaderRow key={headerGroup.id}>
                            <SortableContext
                                items={headerGroup.headers.map(header => header.id)}
                                strategy={horizontalListSortingStrategy}
                            >
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </SortableContext>
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
            </DndContext>
        </>
    )
}