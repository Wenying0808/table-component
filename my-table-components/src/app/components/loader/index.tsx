import { CircularProgress } from '@mui/material';

export default function Loader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', width: '80vw' }}>
            <CircularProgress color="inherit" />
        </div>
    )
}
