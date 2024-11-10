import { colors } from "@/app/styles/colors";

export default function PlaceholderNoResult() {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh', 
            width: '80vw', 
            backgroundColor: colors.black, 
            color: colors.alto, 
            textAlign: 'center', 
            lineHeight: '1.5'

        }}>
            No data found<br/>
            Please try a different search
        </div>
    )
}