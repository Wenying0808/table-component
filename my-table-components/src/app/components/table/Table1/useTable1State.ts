import { useState, useCallback } from 'react';
import { VisibilityState } from '@tanstack/react-table';
import { BaseAnalysis } from '@/app/types/DataTypes';
import { DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ColumnOption } from '@/app/types/TableTypes';

export const useTable1State = (
    initialColumnOrder: string[], 
    initialColumnVisibility: VisibilityState
) => {
    const [data, setData] = useState<BaseAnalysis[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isAddingData, setIsAddingData] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);


    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleFetchData = useCallback(async (search = searchValue) => {
        try {
            setIsDataLoading(true);
            const searchQuery = search !== '' ? `?search=${encodeURIComponent(search)}` : '';
            const response = await fetch(`/pages/api/table1${searchQuery}`);
            const table1 = await response.json();
            setData(table1);
            return table1;
        } catch (error) {
            console.error('Error fetching data from table1:', error);
        } finally {
            setIsDataLoading(false);
        }
    }, [searchValue]);

    const handleNameSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = e.target.value;
        setSearchValue(newSearchValue);
        await handleFetchData(newSearchValue);
    }, [handleFetchData]);

    const handleClearSearch = useCallback(async () => {
        setSearchValue('');
        await handleFetchData('');
    }, [handleFetchData]);

    const handleAddData = useCallback(async () => {
        const statusOptions = ["Queued", "Running", "Completed", "Failed"];
        const userOptions = ["Paul Smith", "John Doe", "Jane Lin", "Alice Johnson", "Bob Brown"];
        const durationOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        
        try {
            setIsAddingData(true);
            const newData = {
                "name": `New Analysis ${Math.floor(Math.random() * 100)}`,
                "status": statusOptions[Math.floor(Math.random() * statusOptions.length)],
                "user": userOptions[Math.floor(Math.random() * userOptions.length)],
                "actions": ['Report'],
                "duration": durationOptions[Math.floor(Math.random() * durationOptions.length)]
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
    }, [handleFetchData]);

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
        data,
        isDataLoading,
        isAddingData,
        searchValue,
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
        isAddColumnModalOpen,
        setIsAddColumnModalOpen,
        handleFetchData,
        handleNameSearch,
        handleClearSearch,
        handleAddData,
        handleAddColumns,
        handleRemoveColumn,
        handleDragEnd,
        sensors
    };
};