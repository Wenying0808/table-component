"use client";

// React and core dependencies
import { useEffect, useMemo, useState } from "react";

// External UI libraries
import { IconButton, Input, SelectChangeEvent, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Table related external libraries
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

// Internal components
import Navbar from "@/app/components/navbar/navbar";
import Loader from "@/app/components/loader";
import { DataFilter, StatusFilterOptions, MenuItemOption } from "@/app/components/DataFilter";

//Table Copmonents
import PlaceholderNoResult from "@/app/components/table/PlaceholderNoResult";
import ColumnHeader from "@/app/components/table/ColumnHeader";
import { TableCellStatus } from "@/app/components/table/StatusCell";
import { TableCellActions } from "@/app/components/table/ActionsCell";
import { ColumnHeaderAdd } from "@/app/components/table/ColumnHeaderAdd";
import { AddColumnModal } from "@/app/components/table/AddColumnModal";
import { TableColumnHeaderRow } from "@/app/components/table/TableColumnHeaderRow";
import { Table1Row } from "@/app/components/table/Table1Row";

// Utilities and types
import { colors } from "@/app/styles/colors";
import { spacing } from "@/app/styles/spacing";
import { fonts } from "@/app/styles/fonts";
import { BaseAnalysis, FilterParams } from "@/app/types/DataTypes";
import TableColumnsManagement from "@/app/tableManagement/tableColumnsManagement";


export default function Table1Page() {
    const columnHelper = createColumnHelper<BaseAnalysis>();
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [userFilterOptions, setUserFilterOptions] = useState<Array<MenuItemOption>>([{label: "All", value: "All"}]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [isAddingData, setIsAddingData] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Queued' | 'Running' | 'Completed' | 'Failed'>('All');
    const [userFilter, setUserFilter] = useState<string>('All');
    const [sorting, setSorting] = useState<SortingState>([ 
        { id: 'updatedTime', desc: true }
    ]);

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
        initialColumnOrder: ['id', 'name', 'status', 'actions', 'add'],
        initialColumnVisibility: {
            'id': true,
            'name': true,
            'user': false,
            'status': true,
            'duration': false,
            'actions': true,
            'updatedTime': false,
            'add': true,
        }
    })

    // column definitions
    const availableColumns = useMemo(() => {
        if (data.length === 0) return [];
        // get the keys of the first object in the array and filter out the ones which columnVisibility is false
        return Object.keys(data[0])
            .map(key => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1)
            }))
            .filter(column => column.value !== "_id" &&!columnVisibility[column.value as keyof typeof columnVisibility])
            .sort((a, b) => a.value.localeCompare(b.label));
    }, [data, columnVisibility]);

    const columns = useMemo(() => [
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
    ], []);

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

    // data fetching and handling
    const handleFetchData = async (filters: FilterParams = {
        name: nameFilter, 
        status: statusFilter,
        user: userFilter
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
            if(filters.user) {
                params.append('user', filters.user);
            }
            const queryString = params.toString();
            const response = await fetch(`/pages/api/table1?${queryString}`);
            const table1 = await response.json();
            /*console.log("Fetched table1 data from db",table1);*/
            setData(table1);
            return table1;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsDataLoading(false);
        }
    }

    const handleAddData = async () => {
        const statusOptions = ["Queued", "Running", "Completed", "Failed"];
        const userOptions = ["Paul Smith", "John Doe", "Jane Lin", "Alice Johnson", "Bob Brown"];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const randomUser = userOptions[Math.floor(Math.random() * userOptions.length)];
        try {
            setIsAddingData(true);
            const newData = {
                "name": `New Analysis ${Math.floor(Math.random() * 100)}`,
                "status": randomStatus,
                "user": randomUser,
                "actions": ['Report'],
            };
            const response = await fetch('/pages/api/table1', {
                method: 'POST',
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to add data');
            }
            await handleFetchData();
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsAddingData(false);
        }
    }

    // Search Functions

    const handleNameSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const searchValue = e.target.value;
            /*console.log("filter:", searchValue);*/
            setNameFilter(searchValue);
            await handleFetchData({ name: searchValue, status: statusFilter, user: userFilter});
        } catch (error) {
            console.error('Error searching by name:', error);
        }
    }
    /*console.log("search value:", searchValue);*/

    const handleClearSearch = async () => {
        try{
            setNameFilter('');
            const data = await handleFetchData({ name: '', status: statusFilter, user: userFilter});
            setData(data);
        } catch (error) {
            console.error('Error clearing search:', error);
        }
    }

    const handleStatusFilterChange = async (e: SelectChangeEvent<string>) => {
        setStatusFilter(e.target.value as 'All' | 'Queued' | 'Running' | 'Completed' | 'Failed');
        await handleFetchData({ name: nameFilter, status: e.target.value as 'All' | 'Queued' | 'Running' | 'Completed' | 'Failed', user: userFilter});
    }

    const handleUserFilterChange = async (e: SelectChangeEvent<string>) => {
        setUserFilter(e.target.value);
        await handleFetchData({ name: nameFilter, status: statusFilter, user: e.target.value});
    }

    useEffect(() => {
        handleFetchData();
    }, []);


    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <div className="table-control-bar" 
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', width: 'fit-content',height: spacing.filter_component_height}}
                >
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        width: 'fit-content',
                        padding: '4px 8px',
                        backgroundColor: colors.white, 
                        borderRadius: '4px', 
                        border: `1px solid ${colors.manatee}`
                    }}>
                        <Input 
                            placeholder="Search by name..." 
                            value={nameFilter}
                            onChange={handleNameSearch} 
                            disableUnderline
                            sx={{
                                width: 'fit-content', 
                                color: colors.black,
                                fontSize: fonts.filter_component_font_size,
                            }}
                        />
                        {nameFilter && 
                            <Tooltip title="Clear Search" placement="top">
                                <IconButton onClick={handleClearSearch} sx={{ width: "24px", height: "24px"}}>
                                    <ClearIcon sx={{ fontSize: "14px"}}/>
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                    <DataFilter 
                        id="status-filter"
                        value={statusFilter}
                        icon={<ScatterPlotOutlinedIcon/>}
                        options={StatusFilterOptions}
                        onChange={handleStatusFilterChange}
                    />
                    <DataFilter 
                        id="user-filter"
                        value={userFilter}
                        icon={<PersonOutlineIcon/>}
                        options={userFilterOptions}
                        onChange={handleUserFilterChange}
                    />
                    <LoadingButton size="medium"
                        onClick={handleAddData}
                        endIcon={<AddCircleIcon />}
                        loading={isAddingData}
                        loadingPosition="end"
                        variant="contained"
                        sx={{
                            color: colors.white,
                            backgroundColor: colors.azure,
                            '&:hover': {
                                backgroundColor: colors.azure,
                            }
                        }}
                    >
                        Add Data
                    </LoadingButton>
                </div>
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
                </>:
                    <PlaceholderNoResult />
                }
            </main>
        </div>
    )
}