import React from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import { SortingDirection, TableColumnHeaderProps } from '../../../types/TableTypes';
import { useState } from 'react';
import { colors } from '../../../styles/colors';

export default function ColumHeader({ children, isSortable = false, sortingState, handleSorting, handleRemoveColumn } : TableColumnHeaderProps ) {
    const [isHovered, setIsHovered] = useState(false);
    const getSortingIcon = (sortingDirection: SortingDirection) => {
        if (sortingDirection === 'asc') return <ArrowUpwardIcon onClick={handleSorting} style={{color: colors.azure, cursor: 'pointer'}} />;
        if (sortingDirection === 'desc') return <ArrowDownwardIcon onClick={handleSorting} style={{color: colors.azure, cursor: 'pointer'}} />;
        if (sortingDirection === false && isHovered) return <ArrowUpwardIcon onClick={handleSorting}style={{color: colors.manatee, cursor: 'pointer'}} />;
        return null;
    };
    return (
        <span 
            className="table-header"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
            
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && 
                <CancelIcon 
                    onClick={handleRemoveColumn} 
                    style={{
                        color: colors.manatee, 
                        cursor: 'pointer'
                    }} 
                />
            } 
            {isSortable && (sortingState || isHovered) &&
                getSortingIcon(sortingState)
            }
            
        </span>
    )
}