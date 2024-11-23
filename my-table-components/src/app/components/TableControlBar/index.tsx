import { SelectChangeEvent } from "@mui/material";

import { memo } from "react";
import { LoadingButton } from "@mui/lab";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import { colors } from "@/app/styles/colors";
import { spacing } from "@/app/styles/spacing";
import { DataFilter, MenuItemOption } from "@/app/components/DataFilter";

import Search from "@/app/components/Search";

import ArchiveFilter from "@/app/components/ArchiveFilter";

interface TableControlBarProps {
    nameFilter: string;
    statusFilter: string;
    userFilter: string;
    timeRangeFilter: string;
    isArchivedFilter: boolean;
    selectedRows: string[];
    totalRows: number;
    isAddingData: boolean;
    isArchivingData: boolean;
    isUnarchivingData: boolean;
    onNameSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearNameSearch: () => void;
    onStatusFilterChange: (e: SelectChangeEvent<string>) => void;
    onUserFilterChange: (e: SelectChangeEvent<string>) => void;
    onTimeRangeFilterChange: (e: SelectChangeEvent<string>) => void;
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

const statusFilterOptions: Array<MenuItemOption> =[
    {label: "All Status", value: "All Status"},
    {label: "Queued", value: "Queued"},
    {label: "Running", value: "Running"},
    {label: "Completed", value: "Completed"},
    {label: "Failed", value: "Failed"}
];

const userFilterOptions: Array<MenuItemOption> =[
    {label: "All Users", value: "All Users"},
    {label: "My Analyses", value: "My Analyses"}
];

const timeRangeFilterOptions: Array<MenuItemOption> =[
    {label: "All Time", value: "All Time"},
    {label: "Today", value: "Today"},
    {label: "This Week", value: "This Week"},
    {label: "This Month", value: "This Month"}
];


const TableControlBar = memo(({
    nameFilter,
    statusFilter,
    userFilter,
    timeRangeFilter,
    isArchivedFilter,
    selectedRows,
    totalRows,
    isAddingData,
    isArchivingData,
    isUnarchivingData,
    onNameSearch,
    onClearNameSearch,
    onStatusFilterChange,
    onUserFilterChange,
    onTimeRangeFilterChange,
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
                    options={statusFilterOptions}
                    onChange={onStatusFilterChange}
                />
                <DataFilter 
                    id="user-filter"
                    value={userFilter}
                    icon={<PersonOutlineIcon />}
                    options={userFilterOptions}
                    onChange={onUserFilterChange}
                />
                <DataFilter 
                    id="time-filter"
                    value={timeRangeFilter}
                    icon={<AccessTimeOutlinedIcon />}
                    options={timeRangeFilterOptions}
                    onChange={onTimeRangeFilterChange}
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