"use client";

import Loader from "@/app/components/loader";
import Navbar from "@/app/components/navbar/navbar";
import { TableCellActions } from "@/app/components/table/ActionsCell";
import { AddColumnModal } from "@/app/components/table/AddColumnModal";
import ColumnHeader from "@/app/components/table/ColumnHeader";
import { ColumnHeaderAdd } from "@/app/components/table/ColumnHeaderAdd";
import { checkboxStyle } from "@/app/components/table/ColumnHeaderCheckbox/ColumnHeaderCheckbox";
import PlaceholderNoResult from "@/app/components/table/PlaceholderNoResult";
import { TableCellStatus } from "@/app/components/table/StatusCell";
import { Table3CellExpand } from "@/app/components/table/Table3CellExpand";
import { Table3Row } from "@/app/components/table/Table3Row";
import { TableColumnHeaderRow } from "@/app/components/table/TableColumnHeaderRow";
import TableControlBar from "@/app/components/TableControlBar";
import { randomStatus, randomUser, statusProps } from "@/app/tableFunctions/tableAddData/tableAddData";
import TableColumnsManagement from "@/app/tableFunctions/tableManagement/tableColumnsManagement";
import { AppTaskAnalysis, FilterParams, StatusFilter, TaskAnalysis, TimeRangeFilter, WorkflowTaskAnalysis } from "@/app/types/DataTypes";
import { ExpandableRow } from "@/app/types/TableTypes";
import { DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Checkbox, SelectChangeEvent } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, Row, SortingState, useReactTable } from "@tanstack/react-table";
import React, { useCallback, useEffect } from "react";
import { useMemo, useState } from "react";

export default function Table3Page() {
    const columnHelper = createColumnHelper<WorkflowTaskAnalysis>();
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [isAddingData, setIsAddingData] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status');
    const [userFilter, setUserFilter] = useState<string>('All Users');
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRangeFilter>('All Time');
    const [isArchivedFilter, setIsArchivedFilter] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([ {id: 'updatedTime', desc: true} ]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isArchivingData, setIsArchivingData] = useState<boolean>(false);
    const [isUnarchivingData, setIsUnarchivingData] = useState<boolean>(false);
    const basePath = process.env.GITHUB_PATH || ''; 

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
        initialColumnOrder: ['expand', 'select', 'name', 'status', 'actions', 'add'],
        initialColumnVisibility: {
            'expand': true,
            'select': true,
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

    const availableColumns = useMemo(() => {
        if (data.length === 0) return [];
        // get the keys of the first object in the array and filter out the ones which columnVisibility is false and the ones that are inside analyses
        return Object.keys(data[0])
            .map(key => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))
            .filter(column => column.value !== "_id" && column.value !== "isArchived" && column.value !== 'appAnalyses' && !columnVisibility[column.value as keyof typeof columnVisibility])
            .sort((a, b) => a.value.localeCompare(b.label));
    }, [data, columnVisibility]);


    // Selection Functions
    const handleRowSelection = useCallback((rowId: string) => {
        setSelectedRows(prev => 
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    }, []);
    const handleSelectAllRows = useCallback(() => {
        if (data.length > 0 && selectedRows.length === data.length) {
            /*console.log('Unselecting all rows');*/
            setSelectedRows([]);
        } else {
            /*console.log('Selecting all rows');*/
            setSelectedRows(data
                .map(row => row._id!)
            );
        }
    }, [data, selectedRows]);
    /*console.log('selectedRows:', selectedRows);*/

    // Column Definitions
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => <Table3CellExpand row={row as Row<ExpandableRow>} />,
            header: () => <span className="table-header"></span>,
            enableHiding: false,
        }),
        columnHelper.display({
            id: 'select',
            header: () => (
                <Checkbox
                    checked={data.length > 0 && selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    onChange={handleSelectAllRows}
                    sx={checkboxStyle}
                />
            ),
            cell: ({ row }) => (
                row.depth === 0 ? (
                    <Checkbox
                        checked={selectedRows.includes(row.original._id!)}
                        onChange={() => handleRowSelection(row.original._id!)}
                        sx={checkboxStyle}
                    />
                ) : null
            ),
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
    ], [columnHelper, handleRemoveColumn, setIsAddColumnModalOpen, selectedRows, data, handleRowSelection, handleSelectAllRows])

    type Table3RowData = WorkflowTaskAnalysis | AppTaskAnalysis | TaskAnalysis;

    const table = useReactTable({
        columns,
        data,
        getSubRows: (row: Table3RowData) => {
            /*console.log('getSubRows called with:', row);*/
            if (row && 'appAnalyses' in row) {
                return row.appAnalyses;
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
    
    const handleFetchData = useCallback(async (filters: FilterParams = {
        name: nameFilter,
        status: statusFilter,
        user: userFilter,
        timeRange: timeRangeFilter,
        isArchived: isArchivedFilter,
    }) => {
        try{
            setIsDataLoading(true);
            const params = new URLSearchParams();
            if (filters.name) {
                params.append('name', filters.name);
            }
            if (filters.status) {
                params.append('status', filters.status);
            }
            if (filters.user) {
                params.append('user', filters.user);
            }
            if (filters.timeRange) {
                params.append('timeRange', filters.timeRange);
            }
            if (filters.isArchived !== undefined) {
                params.append('isArchived', filters.isArchived.toString());
            } 
            const queryString = params.toString();
            const response = await fetch(`${basePath}/pages/api/table3?${queryString}`);
            const table3Data = await response.json();
            setData(table3Data);
        } catch (error) {
            console.error('Failed to fetch table3 data:', error);
        } finally {
            setIsDataLoading(false);
        }
    }, [basePath, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleAddData = useCallback(async () => {
        try{
            setIsAddingData(true);
            const createNewTasks = () => {
                return {
                    "name": `Task ${Math.floor(Math.random() * 100)}`,
                    "status": randomStatus,
                    "actions": statusProps.actions,
                    "duration": statusProps.duration,
                };
            }
            const createNewAppAnalysis = () => {
                return {
                    "name": `App analysis ${Math.floor(Math.random() * 100)}`,
                    "status": randomStatus,
                    "actions": statusProps.actions,
                    "duration": statusProps.duration,
                    "tasks":[createNewTasks(), createNewTasks(), createNewTasks()]
                };
            };
            const newData = {
                "name": `Workflow ${Math.floor(Math.random() * 100)}`,
                "status": randomStatus,
                "user": randomUser,
                "actions": statusProps.actions,
                "duration": statusProps.duration,
                "isArchived": false,
                "appAnalyses": [createNewAppAnalysis(), createNewAppAnalysis(), createNewAppAnalysis()],
            };

            console.log("newData:", newData);

            const response = await fetch(`${basePath}/pages/api/table3`, {
                method: 'POST',
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to add data to table3');
            }
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Failed to add data:', error);
        } finally {
            setIsAddingData(false);
        }
    }, [basePath, handleFetchData, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleNameSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setNameFilter(e.target.value);
            await handleFetchData({name: e.target.value, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Failed to search table3 data by name:', error);
        }
    }, [handleFetchData, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleClearNameSearch = useCallback(async () => {
        try{
            setNameFilter('');
            await handleFetchData({name: '', status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Failed to clear search:', error);
        }
    }, [handleFetchData, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleStatusFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        try {
            setStatusFilter(e.target.value as StatusFilter);
            await handleFetchData({name: nameFilter, status: e.target.value as StatusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Failed to filter table3 data by status:', error);
        }
    }, [handleFetchData, nameFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleUserFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        try { 
            setUserFilter(e.target.value);
            await handleFetchData({name: nameFilter, status: statusFilter, user: e.target.value, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Failed to filter table3 data by user:', error);
        }
    }, [handleFetchData, nameFilter, statusFilter, timeRangeFilter, isArchivedFilter]);

    const handleTimeRangeFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        setTimeRangeFilter(e.target.value as TimeRangeFilter);
    }, []);

    const handleArchiveFilterChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        try{
            setIsArchivedFilter(e.target.checked);
            setSelectedRows([]);
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: e.target.checked});
        } catch (error) {
            console.error('Failed to filter table3 data by archive:', error);
        }
    }, [handleFetchData, nameFilter, statusFilter, userFilter, timeRangeFilter]);


    const handleArchiveSelectedRows = useCallback(async () => {
        try {
            setIsArchivingData(true);
            const requestBody = {
                ids: selectedRows,
                action: "archive"
            }
            const response = await fetch(`${basePath}/pages/api/table3`, {
                method: 'PATCH',
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Failed to archive selected rows');
            }
            await handleFetchData({
                name: nameFilter, 
                status: statusFilter, 
                user: userFilter, 
                timeRange: timeRangeFilter, 
                isArchived: isArchivedFilter
            });
        } catch(error){
            console.error('Failed to archive selected rows:', error);
        } finally {
            setIsArchivingData(false);
            setSelectedRows([]);
        }
    }, [basePath, handleFetchData, selectedRows, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleUnarchiveSelectedRows = useCallback(async () => {
        try{
            setIsUnarchivingData(true);
            const requestBody = {
                ids: selectedRows,
                action: "unarchive"
            }
            const response = await fetch(`${basePath}/pages/api/table3`, {
                method: 'PATCH',
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Failed to unarchive selected rows');
            }
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch(error){
            console.error('Failed to unarchive selected rows:', error);
        } finally {
            setIsUnarchivingData(false);
            setSelectedRows([]);
        }
    }, [basePath, handleFetchData, selectedRows, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);
    
    const handleClearFilters = useCallback(async () => {
        try { 
            setNameFilter('');
            setStatusFilter('All Status');
            setUserFilter('All Users');
            setTimeRangeFilter('All Time');
            setIsArchivedFilter(false);
            setSelectedRows([]);
            
            await handleFetchData({
                name: '', 
                status: 'All Status', 
                user: 'All Users', 
                timeRange: 'All Time', 
                isArchived: false
            });
        } catch (error) {
            console.error('Failed to clear filters:', error);
        }
    }, [handleFetchData]);
    
    useEffect(() => {
        handleFetchData();
    }, [handleFetchData]);
    
    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <TableControlBar
                    nameFilter={nameFilter}
                    statusFilter={statusFilter}
                    userFilter={userFilter}
                    timeRangeFilter={timeRangeFilter}
                    isArchivedFilter={isArchivedFilter}
                    selectedRows={selectedRows}
                    totalRows={data.length}
                    isAddingData={isAddingData}
                    isArchivingData={isArchivingData}
                    isUnarchivingData={isUnarchivingData}
                    onNameSearch={handleNameSearch}
                    onClearNameSearch={handleClearNameSearch}
                    onStatusFilterChange={handleStatusFilterChange}
                    onUserFilterChange={handleUserFilterChange}
                    onTimeRangeFilterChange={handleTimeRangeFilterChange}
                    onArchiveFilterChange={handleArchiveFilterChange}
                    onAddData={handleAddData}
                    onArchiveRows={handleArchiveSelectedRows}
                    onUnarchiveRows={handleUnarchiveSelectedRows}
                />
                {isDataLoading
                    ? <Loader />
                    : data.length > 0 ?
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
                                                <Table3Row key={row.id} row={row as Row<ExpandableRow>}>
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
                    : <PlaceholderNoResult onClearFilters={handleClearFilters} />}
            </main>
        </div>
    )
}