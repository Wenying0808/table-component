import { IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ColumnHeaderAddProps } from '@/app/types/TableTypes';
import { colors } from '../../../styles/colors';

export const ColumnHeaderAdd: React.FC<ColumnHeaderAddProps > = ({ onClick })  => {
    return (
        <>
            <Tooltip title="Add column" placement="top">
                <IconButton onClick={onClick} sx={{ color: colors.azure, '&:hover': { backgroundColor: colors.linkWater }, cursor: 'pointer'}}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Tooltip>
        </>
    )
}