import { Input, IconButton, Tooltip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { colors } from "@/app/styles/colors";
import { fonts } from "@/app/styles/fonts";

interface SearchProps {
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

const searchStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    width: 'fit-content',
    padding: '4px 8px',
    backgroundColor: colors.white, 
    borderRadius: '4px', 
    border: `1px solid ${colors.manatee}`,
}

const inputStyle = {
    width: 'fit-content', 
    color: colors.black,
    fontSize: fonts.filter_component_font_size,
}

export default function Search({
    value,
    placeholder,
    onChange,
    onClear
}: SearchProps) {  
    return (
        <div style={searchStyle}>
            <Input 
                placeholder={placeholder}
                value={value}
                onChange={onChange} 
                disableUnderline
                sx={inputStyle}
            />
            {value ?
                <Tooltip title="Clear Search" placement="top">
                    <IconButton onClick={onClear} sx={{ width: "24px", height: "24px"}}>
                        <ClearIcon sx={{ fontSize: "14px"}}/>
                    </IconButton>
                </Tooltip>
                : <SearchOutlinedIcon sx={{ fontSize: "14px", color: colors.manatee }}/>
            }
            
        </div>
    )
}