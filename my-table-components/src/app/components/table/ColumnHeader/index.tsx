import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { SortingDirection, TableColumnHeaderProps } from '../../../types/TableTypes';
import { useState } from 'react';
import { colors } from '../../../styles/colors';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from '@mui/material';

export default function ColumnHeader({ id, children, isSortable = false, sortingState, columnIsRemoveable, handleSorting, handleRemoveColumn } : TableColumnHeaderProps ) {
    const [isHovered, setIsHovered] = useState(false);
    const getSortingIcon = (sortingDirection: SortingDirection) => {
        if (sortingDirection === 'asc') return <ArrowUpwardIcon onClick={handleSorting} style={{color: colors.azure, cursor: 'pointer'}} />;
        if (sortingDirection === 'desc') return <ArrowDownwardIcon onClick={handleSorting} style={{color: colors.azure, cursor: 'pointer'}} />;
        if (sortingDirection === false && isHovered) return <Tooltip title="Sort Column" placement="top"><ArrowUpwardIcon onClick={handleSorting} style={{color: colors.manatee, cursor: 'pointer'}} /></Tooltip>;
        return null;
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: id
    });

    const spanStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? colors.alto : 'transparent',
        borderRight: `1px solid ${colors.gallery}`,
        paddingRight: '10px',
    }

    const dragIndicatorStyle = {
        color: colors.manatee,
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    return (
        <span 
            className="table-header"
            style={spanStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={setNodeRef}
            
        >
            <div style={{ 
                overflow: 'hidden' ,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }}>
                {children}
            </div>
            {isSortable && (sortingState || isHovered) &&
                getSortingIcon(sortingState)
            }
            {columnIsRemoveable && isHovered && 
                <Tooltip title="Remove Column" placement="top">
                    <CancelIcon 
                        onClick={handleRemoveColumn} 
                        style={{
                            color: colors.manatee, 
                            cursor: 'pointer'
                        }} 
                    />
                </Tooltip>
            }
            {isHovered && 
                <DragIndicatorIcon 
                    style={dragIndicatorStyle} 
                    
                    {...attributes}
                    {...listeners}
                />
            }
        </span>
    )
}