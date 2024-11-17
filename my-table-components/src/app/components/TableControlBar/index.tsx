import { SelectChangeEvent } from "@mui/material";

import { memo } from "react";
import { LoadingButton } from "@mui/lab";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { colors } from "@/app/styles/colors";
import { spacing } from "@/app/styles/spacing";
import { DataFilter, StatusFilterOptions, MenuItemOption } from "@/app/components/DataFilter";

import Search from "@/app/components/Search";

import ArchiveFilter from "@/app/components/ArchiveFilter";

interface TableControlBarProps {
    nameFilter: string;
    statusFilter: string;
    userFilter: string;
    isArchivedFilter: boolean;
    selectedRows: string[];
    totalRows: number;
    isAddingData: boolean;
    isArchivingData: boolean;
    isUnarchivingData: boolean;
    userFilterOptions: Array<MenuItemOption>;
    onNameSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearNameSearch: () => void;
    onStatusFilterChange: (e: SelectChangeEvent<string>) => void;
    onUserFilterChange: (e: SelectChangeEvent<string>) => void;
    onArchiveFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddData: () => void;
    onArchiveRows: () => void;
    onUnarchiveRows: () => void;
}

 // styles
 const controlBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: spacing.filter_component_height
}

const ControlbarLeftContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
}

const ControlbarRightContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
}

const primaryButtonStyle = {
    color: colors.white,
    backgroundColor: colors.azure,
    '&:hover': {
        backgroundColor: colors.azure,
    }
}

const secondaryButtonStyle = {
    color: colors.azure,
}


const TableControlBar = memo(({
    nameFilter,
    statusFilter,
    userFilter,
    isArchivedFilter,
    selectedRows,
    totalRows,
    isAddingData,
    isArchivingData,
    isUnarchivingData,
    userFilterOptions,
    onNameSearch,
    onClearNameSearch,
    onStatusFilterChange,
    onUserFilterChange,
    onArchiveFilterChange,
    onAddData,
    onArchiveRows,
    onUnarchiveRows,
}: TableControlBarProps) => {
    return (
        <div className="table-control-bar" style={controlBarStyle}>
            <div style={ControlbarLeftContainerStyle}>
                <Search 
                    value={nameFilter}
                    placeholder="Search by name..."
                    onChange={onNameSearch}
                    onClear={onClearNameSearch}
                />
                <DataFilter 
                    id="status-filter"
                    value={statusFilter}
                    icon={<ScatterPlotOutlinedIcon/>}
                    options={StatusFilterOptions}
                    onChange={onStatusFilterChange}
                />
                <DataFilter 
                    id="user-filter"
                    value={userFilter}
                    icon={<PersonOutlineIcon />}
                    options={userFilterOptions}
                    onChange={onUserFilterChange}
                />
                <ArchiveFilter 
                    isArchived={isArchivedFilter}
                    onChange={onArchiveFilterChange}
                />
            </div>     
            <div style={ControlbarRightContainerStyle}>
                { selectedRows.length > 0 
                    ? isArchivedFilter
                        ? <LoadingButton 
                            onClick={onUnarchiveRows} 
                            sx={secondaryButtonStyle} 
                            loading={isUnarchivingData} 
                            loadingPosition="start">
                                Unarchive
                            </LoadingButton>
                        : <LoadingButton 
                            onClick={onArchiveRows} 
                            sx={secondaryButtonStyle} 
                            loading={isArchivingData} 
                            loadingPosition="start">
                                Archive
                            </LoadingButton>
                    : null
                }
                <LoadingButton size="medium"
                    onClick={onAddData}
                    endIcon={<AddCircleIcon />}
                    loading={isAddingData}
                    loadingPosition="end"
                    variant="contained"
                    sx={primaryButtonStyle}
                >
                    Add Data
                </LoadingButton>
                <div>
                    {selectedRows.length} of {totalRows} selected
                </div>
            </div>
        </div>
    );
})

TableControlBar.displayName = 'TableControlBar';

export default TableControlBar;