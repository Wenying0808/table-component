import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { colors } from '../../styles/colors';
import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';

export const TableCellActions = ({ data }: { data: string[]} ) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

    return (
        <td>
            <Button
                variant="outlined"
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                sx={{
                    color: colors.azure,
                    padding: "2px 8px",
                    fontSize: '0.75rem',
                    border: `2px solid`,
                }}
            >
                Actions
            </Button>  
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {data.map((d, index) => (
                    <MenuItem key={index} onClick={handleClose}>{d}</MenuItem>
                ))}
            </Menu>

        </td>
    )
};