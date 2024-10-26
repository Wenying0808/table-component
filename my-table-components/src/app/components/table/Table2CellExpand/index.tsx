import { IconButton } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ExpandableRow, TableCellExpandProps } from '@/app/types/TableTypes';
import { colors } from '../../styles/colors';

export const Table2CellExpand = <T extends ExpandableRow>({ row }: TableCellExpandProps<T>) => {
    const cellStyles = {
        paddingLeft: "8px", 
        height: row.depth === 0 ? "46px" : "34px", 
        borderLeft: row.depth === 0 ? `4px solid ${colors.azure}` : "none"
    };

    return (
        <div style={cellStyles}>
            {row.depth === 0 && row.getCanExpand() ? (
                <IconButton 
                    onClick={() => row.toggleExpanded()} 
                    sx={{ color: colors.azure }}
                >
                    {row.getIsExpanded() ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </IconButton>
            ) : null}
        </div>
    )
};