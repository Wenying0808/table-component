import { useState, useEffect, useMemo } from "react";
import { WorkflowTaskAnalysis } from "../../../types/DataTypes";
import table3Data from "../../../data/MockData_Table3.json";
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";
import { TableColumnHeaderRow } from "../TableColumnHeaderRow";

export default function Table3() {
    const [data, setData] = useState<WorkflowTaskAnalysis[]>([]);
    const columnHelper = createColumnHelper<WorkflowTaskAnalysis>();

    useEffect(() => {
        setData(table3Data as WorkflowTaskAnalysis[]);
    }, []);

    const columns = useMemo(() => [

        columnHelper.accessor('id', {
            header: 'Id',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
        }),
    ], [])

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
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
                    </TableColumnHeaderRow>))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}