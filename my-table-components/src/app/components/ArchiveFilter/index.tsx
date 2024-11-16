import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { colors } from '@/app/styles/colors';
import Switch from '@mui/material/Switch';
import { spacing } from '@/app/styles/spacing';
import { Tooltip } from '@mui/material';

interface ArchiveFilterProps {
    isArchived: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const filterStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0px'
}

export default function ArchiveFilter({
    isArchived,
    onChange
}: ArchiveFilterProps) {
    return (
        <div style={filterStyle}>
            <Inventory2OutlinedIcon 
                sx={{ 
                    color: colors.white, 
                    width: spacing.filter_component_icon_size, 
                    height: spacing.filter_component_icon_size 
                }} 
            />
            <Tooltip title={isArchived ? "Hide Archived" : "Show Archived"} placement="top">
                <Switch 
                    checked={isArchived} 
                    onChange={onChange} 
                    sx={{
                        '& .MuiSwitch-track': {
                            backgroundColor: colors.white,
                        }}}
                />
            </Tooltip>
        </div>
    );
}
