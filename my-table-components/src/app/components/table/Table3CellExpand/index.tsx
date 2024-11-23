import { IconButton } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ExpandableRow, TableCellExpandProps } from '@/app/types/TableTypes';
import { colors } from '@/app/styles/colors';

export const Table3CellExpand = <T extends ExpandableRow>({ row }: TableCellExpandProps<T>) => {

    const cellStyles = {
        parentCell: {
            paddingLeft: "8px", 
            height: "46px", 
            borderLeft: `4px solid ${colors.azure}`
        },
        childCell: {
            paddingLeft: "8px", 
            height: "34px", 
            borderLeft: `4px solid ${colors.white}`
        },
        grandChildCell: {
            paddingLeft: "8px", 
            height: "34px", 
            borderLeft: "none",
        },
    };
    const getCellStyles = (depth: number) => {
        switch (depth) {
            case 0: return cellStyles.parentCell;
            case 1: return cellStyles.childCell;
            case 2: return cellStyles.grandChildCell;
        }
    }

    return (
        <div style={getCellStyles(row.depth)}>
            {(row.depth === 0 || row.depth === 1) && row.getCanExpand() ? (
                <IconButton 
                    onClick={() => row.toggleExpanded()} 
                    sx={{ 
                        color: row.depth === 0 ? colors.azure : colors.manatee 
                    }}
                    disableRipple
                >
                    {row.getIsExpanded() ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </IconButton>
            ) : null}
        </div>
    )
};