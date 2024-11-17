import { colors } from '../../../styles/colors';
import { useState } from 'react';

interface Table1RowProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export const Table1Row = ({ children, style }: Table1RowProps) => {

    const [isHovered, setIsHovered] = useState(false);

    const rowStyles = {
        fontSize: "14px",
        fontWeight: 500,
        borderBottom: `1px solid ${colors.alto}`,
        height: "34px",
        backgroundColor: isHovered ? `${colors.linkWater}` : "transparent",
    };
    
    return (
        <tr 
            
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </tr>
    )
}