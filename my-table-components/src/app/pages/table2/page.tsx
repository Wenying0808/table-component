"use client";

import Navbar from "@/app/components/navbar/navbar";
import { TableCellActions } from "@/app/components/table/ActionsCell";
import { AddColumnModal } from "@/app/components/table/AddColumnModal";
import ColumnHeader from "@/app/components/table/ColumnHeader";
import { ColumnHeaderAdd } from "@/app/components/table/ColumnHeaderAdd";
import { TableCellStatus } from "@/app/components/table/StatusCell";
import { Table2CellExpand } from "@/app/components/table/Table2CellExpand";
import { Table2Row } from "@/app/components/table/Table2Row";
import { TableColumnHeaderRow } from "@/app/components/table/TableColumnHeaderRow";
import TableColumnsManagement from "@/app/tableManagement/tableColumnsManagement";
import { WorkflowAnalysis } from "@/app/types/DataTypes";
import { ExpandableRow } from "@/app/types/TableTypes";
import { DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, Row, SortingState, useReactTable } from "@tanstack/react-table";
import React from "react";
import { useEffect, useMemo, useState } from "react";


export default function Table2Page() {
    const columnHelper = createColumnHelper<WorkflowAnalysis>();
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState<SortingState>([ {id: 'updatedTime', desc: true} ]);
    
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
        initialColumnOrder: ['expand', 'name', 'status', 'actions', 'add'],
        initialColumnVisibility: {
            'expand': true,
            '_id': false,
            'name': true,
            'status': true,
            'duration': false,
            'user': false,
            'actions': true,
            'updatedTime': false,
            'add': true,
        }
    })

    // define columns
    const availableColumns = useMemo(() => {
        if (data.length === 0) return [];
        // get the keys of the first object in the array and filter out the ones which columnVisibility is false and the ones that are inside appAnalyses
        return Object.keys(data[0])
            .map(key => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))
            .filter(column => column.value !== 'appAnalyses' && !columnVisibility[column.value as keyof typeof columnVisibility])
            .sort((a, b) => a.value.localeCompare(b.label));
    }, [data, columnVisibility]);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table2CellExpand row={row as Row<ExpandableRow>} />,
            header: () => <span className="table-header"></span>
        }),
        columnHelper.accessor('_id', {
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
            enableHiding: true,
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
        columnHelper.accessor('user', {
            cell: info => info.getValue(),
            header: ({ column }) => (
                <ColumnHeader 
                    id={column.id} 
                    isSortable={true} 
                    sortingState={column.getIsSorted()}
                    columnIsRemoveable={true} 
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
    ], []);

    // define table
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
            columnOrder,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
    });

    // fetch data
    const handleFetchData = async () => {
        const response = await fetch('/pages/api/table2');
        const data = await response.json();
        setData(data);
    }
    
    useEffect(() => {
        handleFetchData();
    }, []);

    console.log("table2Data:", data);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
            <>
            <AddColumnModal 
                open={isAddColumnModalOpen} 
                onClose={() => setIsAddColumnModalOpen(false)} 
                columnOptions={availableColumns}
                onAddColumns={handleAddColumns}
            />
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <table className="table2">
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
                                <Table2Row key={row.id} row={row as Row<ExpandableRow>}>
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
            </DndContext>
        </>
            </main>
        </div>
    )
}