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
import { ColumnHeaderAdd } from "../ColumnHeaderAdd";
import { AddColumnModal } from "../AddColumnModal";
import { DndContext } from '@dnd-kit/core';
import TableColumnsManagement from "@/app/tableManagement/tableColumnsManagement";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

export default function Table3() {
    const columnHelper = createColumnHelper<WorkflowTaskAnalysis>();
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const {
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
        isAddColumnModalOpen,
        setIsAddColumnModalOpen,
        handleAddColumns,
        handleRemoveColumn,
        sensors,
        handleDragEnd,
    } = TableColumnsManagement({
        initialColumnOrder: ['expand', 'id', 'name', 'status', 'actions', 'add'],
        initialColumnVisibility: {
            'expand': true,
            'id': true,
            'name': true,
            'status': true,
            'duration': false,
            'user': false,
            'actions': true,
            'updatedTime': false,
            'add': true,
        }
    })

    useEffect(() => {
        setData(table3Data as WorkflowTaskAnalysis[]);
    }, []);

    const availableColumns = useMemo(() => {
        if (data.length === 0) return [];
        // get the keys of the first object in the array and filter out the ones which columnVisibility is false and the ones that are inside analyses
        return Object.keys(data[0])
            .map(key => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))
            .filter(column => column.value !== 'analyses' && !columnVisibility[column.value as keyof typeof columnVisibility])
            .sort((a, b) => a.value.localeCompare(b.label));
    }, [data, columnVisibility]);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table3CellExpand row={row} />,
            header: () => <span className="table-header"></span>,
            enableHiding: false,
        }),
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
                        handleRemoveColumn(column.id);
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
                    id={column.id}
                    isSortable={true}
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={true}
                    handleSorting={() => {
                        column.toggleSorting();
                    }}
                    handleRemoveColumn={() => {
                        handleRemoveColumn(column.id);
                    }}
                >
                    Status
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
                        handleRemoveColumn(column.id);
                    }}
                >
                    Duration
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
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
                        handleRemoveColumn(column.id);
                    }}
                >
                    User
                </ColumnHeader>
            ),
        }),
        columnHelper.accessor('updatedTime', {
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
                        handleRemoveColumn(column.id);
                    }}
                >
                    Updated Time
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
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
    ], [])

    type Table3RowData = WorkflowTaskAnalysis | AppTaskAnalysis | TaskAnalysis;

    const table = useReactTable({
        columns,
        data,
        getSubRows: (row: Table3RowData) => {
            /*console.log('getSubRows called with:', row);*/
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
            columnVisibility,
            columnOrder,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
    });


    return (
        <>
            <AddColumnModal 
                open={isAddColumnModalOpen}
                onClose={() => setIsAddColumnModalOpen(false)}
                columnOptions={availableColumns}
                onAddColumns={handleAddColumns}
            />
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <table className="table3">
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
            </DndContext>
        </>
    );
}