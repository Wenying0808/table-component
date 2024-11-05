import { AddColumnModalProps } from '@/app/types/TableTypes';
import { Button, Modal, Typography } from '@mui/material';
import Select from 'react-select';
import { colors } from '../../styles/colors';

export const AddColumnModal: React.FC<AddColumnModalProps> = ({ open, onClose, columnOptions }) => {
      
    return (
        <Modal open={open}>
            <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 gap: '20px',
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 width: '600px',
                 backgroundColor: 'white',
                 borderRadius: '10px',
                 padding: '40px 20px'
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Columns
                </Typography>
                <Select
                    placeholder="Select columns..."
                    isMulti
                    name="columns"
                    options={columnOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                <div style={{ 
                    display: 'flex',
                    gap:'20px' 
                }}>
                    <Button onClick={onClose} variant="outlined" sx={{ color: colors.azure, borderColor: colors.azure }}>Cancel</Button>
                    <Button onClick={onClose} variant="contained" sx={{ color: colors.white, backgroundColor: colors.azure}}>Add</Button>
                </div>
            </div>
        </Modal>
    )
}