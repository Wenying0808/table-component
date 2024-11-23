import { colors } from "@/app/styles/colors";
import { Button } from "@mui/material";

const ClearFilterButtonStyle = {
    backgroundColor: colors.alto,
    color: colors.black,
    fontSize: '14px',
    borderRadius: '4px',
    padding: '8px 16px',
    marginTop: '16px',
}

interface PlaceholderNoResultProps {
    onClearFilters: () => void;
}

export default function PlaceholderNoResult({ onClearFilters }:  PlaceholderNoResultProps) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh', 
            width: '80vw', 
            backgroundColor: "transparent", 
            color: colors.alto, 
            textAlign: 'center', 
            lineHeight: '1.5'

        }}>
            No data found<br/>
            Please try a different search or clear filters
            <Button 
                sx={ClearFilterButtonStyle}
                onClick={onClearFilters}
            >
                Clear Filters
            </Button>
        </div>
    )
}