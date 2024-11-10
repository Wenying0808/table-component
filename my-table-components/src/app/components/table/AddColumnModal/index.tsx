import { AddColumnModalProps, ColumnOption } from '@/app/types/TableTypes';
import { Button, Modal, Typography } from '@mui/material';
import Select, { MultiValue } from 'react-select';
import { colors } from '../../../styles/colors';
import { useState } from 'react';

export const AddColumnModal: React.FC<AddColumnModalProps> = ({ open, onClose, columnOptions, onAddColumns }) => {
    const [selectedColumns, setSelectedColumns] = useState<ColumnOption[]>([]);

    const handleSelectionChange = (newValue: MultiValue<ColumnOption>) => {
        setSelectedColumns(newValue as ColumnOption[])
    };

    const handleAddColumns = () => {
        onAddColumns(selectedColumns);
        onClose();
        setSelectedColumns([]);
    };

    /*console.log('selectedColumns', selectedColumns);*/

    return (
        <Modal open={open}>
            <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 gap: '30px',
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 width: '600px',
                 color: colors.black,
                 backgroundColor: 'white',
                 borderRadius: '10px',
                 padding: '30px 20px'
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Columns
                </Typography>
                <Select
                    isMulti
                    name="columns"
                    placeholder="Select columns..."
                    options={columnOptions}
                    value={selectedColumns}
                    onChange={handleSelectionChange}
                />
                <div 
                    style={{ 
                        display: 'flex',
                        gap:'20px' 
                }}>
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        sx={{ color: colors.azure, borderColor: colors.azure }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddColumns} 
                        variant="contained" 
                        sx={{ 
                            color: colors.white, 
                            backgroundColor: colors.azure,
                            '&:disabled': {
                                color: colors.white,
                                backgroundColor: colors.moodyBlue,
                            }
                        }}
                        disabled={selectedColumns.length === 0}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </Modal>
    )
}