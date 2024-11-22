import { SelectChangeEvent, Select, MenuItem, SvgIconProps } from "@mui/material";
import { colors } from "@/app/styles/colors";
import { spacing } from "@/app/styles/spacing";
import { fonts } from "@/app/styles/fonts";

export type MenuItemOption = {
    value: string;
    label: string;
}

interface DataFilterProps {
  id: string;
  value: string;
  icon?: React.ReactElement<SvgIconProps>;
  options: Array<MenuItemOption>;
  onChange: (event: SelectChangeEvent<string>) => void;
  width?: string;
}

export const DataFilter = ({
  id,
  value,
  icon,
  options,
  onChange,
  width = spacing.filter_component_width
}: DataFilterProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px'}}>
      {icon}
      <Select
        id={id}
        value={value}
        onChange={onChange}
        sx={{ 
            backgroundColor: colors.white, 
            color: colors.black, 
            fontSize: fonts.filter_component_font_size, 
            width: width, 
            height: spacing.filter_component_height 
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ fontSize: fonts.filter_component_font_size }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};