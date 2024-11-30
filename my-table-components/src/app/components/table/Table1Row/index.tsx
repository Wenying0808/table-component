import { colors } from '@/app/styles/colors';
import { useState } from 'react';

interface Table1RowProps {
    children: React.ReactNode;
    isSelected?: boolean;
    height?: string; //  from virtual rows
}

export const Table1Row = ({ children, height, isSelected }: Table1RowProps) => {

    const [isHovered, setIsHovered] = useState(false);

    const rowStyles = {
        fontSize: "14px",
        fontWeight: 500,
        height: height || "42px",
        backgroundColor: isSelected 
            ? `${colors.linkWater}` 
            : isHovered 
                ? `${colors.linkWater}` 
                : "transparent",
    };
    
    return (
        <tr 
            style={rowStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </tr>
    )
}