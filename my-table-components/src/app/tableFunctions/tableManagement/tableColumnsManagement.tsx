import { DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { VisibilityState } from '@tanstack/react-table';
import { useState } from 'react';
import { ColumnOption, TableColumnsManagementProps } from '@/app/types/TableTypes';

export default function TableColumnsManagement( {initialColumnOrder, initialColumnVisibility}:  TableColumnsManagementProps) {
    const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleAddColumns = (columns: ColumnOption[]) => {
        setColumnVisibility(prev => ({
            ...prev,
            ...Object.fromEntries(columns.map(column => [column.value, true]))
        }));

        setColumnOrder(prevOrder => {
            const newColumns = columns.map(column => column.value);
            const initialColumns = prevOrder.filter(column => column !== 'add');
            return [...initialColumns, ...newColumns, "add"];
        });

        setIsAddColumnModalOpen(false);
    };

    const handleRemoveColumn = (columnId: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnId]: false
        }));
        setColumnOrder(prevOrder => {
            const preservedColumns = prevOrder.filter(col => col !== columnId && col !== 'add');
            return [...preservedColumns, 'add'];
        });
    };

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

    return {
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
        isAddColumnModalOpen,
        setIsAddColumnModalOpen,
        handleAddColumns,
        handleRemoveColumn,
        handleDragEnd,
        sensors,
    };
}