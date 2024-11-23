"use client";

// React and core dependencies
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

// External UI libraries
import { Checkbox, SelectChangeEvent } from "@mui/material";


// Table related external libraries
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

// Internal components
import Navbar from "@/app/components/navbar/navbar";
import TableControlBar from "@/app/components/TableControlBar";
import Loader from "@/app/components/loader";

//Table Copmonents
import PlaceholderNoResult from "@/app/components/table/PlaceholderNoResult";
import ColumnHeader from "@/app/components/table/ColumnHeader";
import { TableCellStatus } from "@/app/components/table/StatusCell";
import { TableCellActions } from "@/app/components/table/ActionsCell";
import { ColumnHeaderAdd } from "@/app/components/table/ColumnHeaderAdd";
import { AddColumnModal } from "@/app/components/table/AddColumnModal";
import { TableColumnHeaderRow } from "@/app/components/table/TableColumnHeaderRow";
import { Table1Row } from "@/app/components/table/Table1Row";
import { checkboxStyle } from "@/app/components/table/ColumnHeaderCheckbox/ColumnHeaderCheckbox";

// Utilities and types
import { BaseAnalysis, FilterParams, StatusFilter, TimeRangeFilter } from "@/app/types/DataTypes";
import TableColumnsManagement from "@/app/tableFunctions/tableManagement/tableColumnsManagement";
import { randomStatus, statusProps, randomUser } from "@/app/tableFunctions/tableAddData/tableAddData";

// Virtulization
import { useVirtualizer } from "@tanstack/react-virtual";




export default function Table1Page() {
    const columnHelper = createColumnHelper<BaseAnalysis>();
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [isAddingData, setIsAddingData] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status');
    const [userFilter, setUserFilter] = useState<string>('All Users');
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRangeFilter>('All Time');
    const [isArchivedFilter, setIsArchivedFilter] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([ 
        { id: 'updatedTime', desc: true }
    ]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isArchivingData, setIsArchivingData] = useState<boolean>(false);
    const [isUnarchivingData, setIsUnarchivingData] = useState<boolean>(false);

    const {
        columnVisibility,
        setColumnVisibility,
        columnOrder,
        setColumnOrder,

        // Column modal state and handlers
        isAddColumnModalOpen,
        setIsAddColumnModalOpen,
        handleAddColumns,
        handleRemoveColumn,

        // Drag and drop functionality
        sensors,
        handleDragEnd,
    } = TableColumnsManagement({
        initialColumnOrder: ['select', 'name', 'status', 'actions', 'add'],
        initialColumnVisibility: {
            'select': true,
            'name': true,
            'user': false,
            'status': true,
            'duration': false,
            'actions': true,
            'updatedTime': false,
            'add': true,
        }
    })

    // column definitions for add column dropdown menu options
    const availableColumns = useMemo(() => {
        if (data.length === 0) return [];
        // get the keys of the first object in the array and filter out the ones which columnVisibility is false
        return Object.keys(data[0])
            .map(key => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))
            // exclude the columns that are the id or isArchived and the ones that are visible
            .filter(column => column.value !== "_id" && column.value !== "isArchived" && !columnVisibility[column.value as keyof typeof columnVisibility])
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
            setSelectedRows(data.map(row => row._id!));
        }
    }, [data, selectedRows]);

    /*console.log('selectedRows:', selectedRows);*/

    const columns = useMemo(() => [
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
                <Checkbox
                    checked={selectedRows.includes(row.original._id!)}
                    onChange={() => handleRowSelection(row.original._id!)}
                    sx={checkboxStyle}
                />
            ),
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
                        handleRemoveColumn(column.id);
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
                        handleRemoveColumn(column.id);
                    }}
                >
                    User
                </ColumnHeader>
            ),
            sortingFn: 'alphanumeric',
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
    ], [selectedRows, data, handleSelectAllRows, handleRowSelection, columnHelper, handleRemoveColumn, setIsAddColumnModalOpen]);

    // table definition
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

    // Virtualization
    const { rows } = table.getRowModel();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current, // target the existing scrollable container
        estimateSize: () => 42, // height of row
        overscan: 10, // number of rows to render outside of the viewport
    })

    // Virtualized rows
    const virtualRows = virtualizer.getVirtualItems();
    const totalHeight = virtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom = virtualRows.length > 0
        ? totalHeight - (virtualRows[virtualRows.length - 1].end || 0)
        : 0;

    console.log("virtualRows", virtualRows);


    // data fetching and handling
    const handleFetchData = useCallback(async (filters: FilterParams = {
        name: nameFilter, 
        status: statusFilter,
        user: userFilter,
        timeRange: timeRangeFilter,
        isArchived: isArchivedFilter
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
            const response = await fetch(`/pages/api/table1?${queryString}`);
            const table1 = await response.json();
            /*console.log("Fetched table1 data from db",table1);*/
            setData(table1);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsDataLoading(false);
        }
    }, [nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleAddData = useCallback(async () => {
        try {
            setIsAddingData(true);
            const newData = {
                "name": `New Analysis ${Math.floor(Math.random() * 100)}`,
                "status": randomStatus,
                "user": randomUser,
                "actions": statusProps.actions,
                "duration": statusProps.duration,
                "isArchived": false,
            };
            const response = await fetch('/pages/api/table1', {
                method: 'POST',
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to add data');
            }
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsAddingData(false);
        }
    }, [handleFetchData, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    // Filter Functions

    const handleNameSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const searchValue = e.target.value;
            /*console.log("filter:", searchValue);*/
            setNameFilter(searchValue);
            await handleFetchData({ name: searchValue, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Error searching by name:', error);
        }
    }, [handleFetchData, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);
    /*console.log("search value:", searchValue);*/

    const handleClearNameSearch = useCallback(async () => {
        try{
            setNameFilter('');
            await handleFetchData({ name: '', status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Error clearing search:', error);
        }
    }, [handleFetchData, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleStatusFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        setStatusFilter(e.target.value as StatusFilter);
        await handleFetchData({ name: nameFilter, status: e.target.value as StatusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
    }, [handleFetchData, nameFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleUserFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        setUserFilter(e.target.value);
        await handleFetchData({ name: nameFilter, status: statusFilter, user: e.target.value, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
    }, [handleFetchData, nameFilter, statusFilter, timeRangeFilter, isArchivedFilter]);

    const handleTimeRangeFilterChange = useCallback(async (e: SelectChangeEvent<string>) => {
        setTimeRangeFilter(e.target.value as TimeRangeFilter);
    }, []);

    const handleArchiveFilterChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsArchivedFilter(e.target.checked);
        setSelectedRows([]);
        await handleFetchData({ name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: e.target.checked});
    }, [handleFetchData, nameFilter, statusFilter, userFilter, timeRangeFilter]);

    const handleArchiveSelectedRows = useCallback(async () => {
        try{
            setIsArchivingData(true);
            const requestBody = {
                ids: selectedRows,
                action: "archive"
            }
            const response = await fetch(`/pages/api/table1`, {
                method: 'PATCH',
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Failed to archive selected rows');
            }
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Error archiving selected rows:', error);
        } finally {
            setIsArchivingData(false);
            setSelectedRows([]);
        }
    }, [handleFetchData, selectedRows, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

    const handleUnarchiveSelectedRows = useCallback(async () => {
        try{
            setIsUnarchivingData(true);
            const requestBody = {
                ids: selectedRows,
                action: "unarchive"
            }
            const response = await fetch(`/pages/api/table1`, {
                method: 'PATCH',
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Failed to archive selected rows');
            }
            await handleFetchData({name: nameFilter, status: statusFilter, user: userFilter, timeRange: timeRangeFilter, isArchived: isArchivedFilter});
        } catch (error) {
            console.error('Error unarchiving selected rows:', error);
        } finally {
            setIsUnarchivingData(false);
            setSelectedRows([]);
        }
    }, [handleFetchData, selectedRows, nameFilter, statusFilter, userFilter, timeRangeFilter, isArchivedFilter]);

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
                {isDataLoading ? 
                    <Loader /> : 
                    data.length > 0 ? 
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
                        <div ref={tableContainerRef} className="table1-container" style={{ height: '70vh', width: '80vw', overflow: 'auto' }}>
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
                                    <tr style={{ height: `${paddingTop}px` }} />
                                        {virtualRows.map(virtualRow => {
                                            const row = rows[virtualRow.index];
                                            return (
                                                <Table1Row 
                                                    key={row.id} 
                                                    height={`${virtualRow.size}px`}
                                                >
                                                    {row.getVisibleCells().map(cell => (
                                                        <td key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    ))}
                                                </Table1Row>
                                            );
                                        })}
                                    <tr style={{ height: `${paddingBottom}px` }} />
                                    {/*table.getRowModel().rows.map(row => (
                                        <Table1Row key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext())}
                                                </td>
                                            ))}
                                        </Table1Row>
                                    ))}*/}
                                </tbody>
                            </table>
                        </div>
                        
                    </DndContext>
                </>:
                    <PlaceholderNoResult onClearFilters={handleClearFilters} />
                }
            </main>
        </div>
    )
}