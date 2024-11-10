import { colors } from '../../../styles/colors';
import { useState } from 'react';



export const Table1Row = ({ children }: { children: React.ReactNode }) => {

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
            style={rowStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </tr>
    )
}