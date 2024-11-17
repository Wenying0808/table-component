import { colors } from '../../../styles/colors';
import { useState } from 'react';

interface Table1RowProps {
    children: React.ReactNode;
    height?: string; //  from virtual rows
}

export const Table1Row = ({ children, height }: Table1RowProps) => {

    const [isHovered, setIsHovered] = useState(false);

    const rowStyles = {
        fontSize: "14px",
        fontWeight: 500,
        height: height || "42px",
        backgroundColor: isHovered ? `${colors.linkWater}` : "transparent",
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