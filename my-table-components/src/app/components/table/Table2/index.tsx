import { useReactTable, getCoreRowModel, createColumnHelper, flexRender, getExpandedRowModel, Row } from '@tanstack/react-table'
import table2Data from '../../../data/MockData_Table2.json';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { colors } from '../../styles/colors';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

type BaseAnalysis = {
    id: string;
    name: string;
    status: string;
    actions: string[];
    updatedTime: string;
    duration: string;
}

type AppAnalysis = BaseAnalysis;

type WorkflowAnalysis = BaseAnalysis & {
    appAnalyses?: AppAnalysis[];
}



const TableColumnHeaderRow = ({ children }: { children: React.ReactNode }) => {
    const rowStyles = {
        fontWeight: 700,
        borderBottom: `2px solid ${colors.alto}`,
        height: "46px",
    };

    return (
        <tr style={rowStyles}>
            {children}
        </tr>
    );
};

const TableRow = ({ row, children }: { row: Row<WorkflowAnalysis>, children: React.ReactNode }) => {
    const rowStyles = {
        parentRow: {
            fontWeight: 600,
            borderBottom: `1px solid ${colors.alto}`,
            height: "46px",
        },
        childRow: {
            fontWeight: 500,
            backgroundColor: `${colors.wildSand}`,
            height: "34px",
        },
    };

    return (
        <tr style={row.depth === 0 ? rowStyles.parentRow : rowStyles.childRow}>
            {children}
        </tr>
    );
};

const TableCellActions = ({ data }: { data: string[]} ) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

    return (
        <td>
            <Button
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            >
                Actions
            </Button>  
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {data.map((d, index) => (
                    <MenuItem key={index} onClick={handleClose}>{d}</MenuItem>
                ))}
            </Menu>

        </td>
    )
}

export default function Table2() {
   
    const [data, setData] = useState<WorkflowAnalysis[]>([]);
    const columnHelper = createColumnHelper<WorkflowAnalysis>();

    useEffect(() => {
        setData(table2Data as WorkflowAnalysis[]);
    }, []);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'expand',
            cell: ({ row }) => {
                return (
                    <div style={{ paddingLeft: "8px", height: "46px", borderLeft: row.depth === 0 ? `4px solid ${colors.azure}` : "none" }}>
                        {row.depth === 0 && row.getCanExpand() ? (
                            <IconButton onClick={() => row.toggleExpanded()} sx={{ color: colors.azure }}>
                                {row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        ) : null}
                    </div>
                )
            },
            header: () => <span className="table-header"></span>
        }),
        columnHelper.accessor('id', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Id
                </span>
            )
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Name
                </span>
            )
        }),
        columnHelper.accessor('duration', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Duration
                </span>
            )
        }),
        columnHelper.accessor('status', {
            cell: info => info.getValue(),
            header: () => (
                <span className="table-header">
                    Status
                </span>
            )
        }),
        columnHelper.accessor('actions', {
            cell: info =><TableCellActions data={info.getValue()} />,
            header: () => (
                <span className="table-header">
                    Actions
                </span>
            )
        }),
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
    });


    return (
        <div className="table1">
            <table>
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
                        <React.Fragment key={row.id}>
                            <TableRow key={row.id} row={row}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext())}
                                    </td>
                                ))}
                            </TableRow>
                        </React.Fragment> 
                    ))}
                </tbody>
            </table>
        </div>
    )
}