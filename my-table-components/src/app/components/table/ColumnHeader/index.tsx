import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { SortingDirection, TableColumnHeaderProps } from '@/app/types/TableTypes';
import { useState } from 'react';
import { colors } from '../../styles/colors';

export default function ColumnHeader({ children, isSortable = false, sortingState, onClick } : TableColumnHeaderProps ) {
    const [isHovered, setIsHovered] = useState(false);
    const getSortingIcon = (sortingDirection: SortingDirection) => {
        if (sortingDirection === 'asc') return <ArrowUpwardIcon style={{color: colors.azure}}/>;
        if (sortingDirection === 'desc') return <ArrowDownwardIcon style={{color: colors.azure}}/>;
        if (sortingDirection === false && isHovered) return <ArrowUpwardIcon style={{color: colors.manatee}} />;
        return null;
    }
    return (
        <span 
            className="table-header"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: isSortable ? 'pointer' : "default",
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isSortable && (sortingState || isHovered) &&
                getSortingIcon(sortingState)
            }
        </span>
    )
}