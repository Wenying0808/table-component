"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table1 from "@/app/components/table/Table1";
import { useEffect, useState } from "react";
import { Button, IconButton, Input, Tooltip } from "@mui/material";
import { colors } from "@/app/styles/colors";
import ClearIcon from '@mui/icons-material/Clear';
import Loader from "@/app/components/loader";


export default function Table1Page() {
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [isAddingData, setIsAddingData] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const handleFetchData = async (search = searchValue) => {
        try{
            setIsDataLoading(true);
            const searchQuery = search !== '' ? `?search=${encodeURIComponent(search)}` : '';
            /*console.log("searchQuery:", searchQuery);*/
            const response = await fetch(`/pages/api/table1${searchQuery}`);
            const table1 = await response.json();
            /*console.log("Fetched table1 data from db",table1);*/
            return table1;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsDataLoading(false);
        }
    }

    const handleAddData = async () => {
        const statusOptions = ["Queued", "Running", "Completed", "Failed"];
        const userOptions = ["Paul Smith", "John Doe", "Jane Lin", "Alice Johnson", "Bob Brown"];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const randomUser = userOptions[Math.floor(Math.random() * userOptions.length)];
        try {
            setIsAddingData(true);
            const newData = {
                "name": `New Analysis ${Math.floor(Math.random() * 100)}`,
                "status": randomStatus,
                "user": randomUser,
                "actions": ['Report'],
            };
            const response = await fetch('/pages/api/table1', {
                method: 'POST',
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to add data');
            }
            const updatedData = await handleFetchData();
            setData(updatedData);
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsAddingData(false);
        }
    }

    const handleNameSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try{
            const searchValue = e.target.value;
            /*console.log("filter:", searchValue);*/
            setSearchValue(searchValue);
            const dataByQuery = await handleFetchData(searchValue);
            setData(dataByQuery);
        } catch (error) {
            console.error('Error searching by name:', error);
        }
    }
    /*console.log("search value:", searchValue);*/

    const handleClearSearch = async () => {
        try{
            setSearchValue('');
            const data = await handleFetchData('');
            setData(data);
        } catch (error) {
            console.error('Error clearing search:', error);
        }
    }

    useEffect(() => {
        handleFetchData().then((d) => setData(d));
    }, []);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <div className="table-control-bar" 
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', width: 'fit-content'}}
                >
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        width: 'fit-content',
                        padding: '4px 8px',
                        backgroundColor: colors.white, 
                        borderRadius: '4px', 
                        border: `1px solid ${colors.manatee}`
                    }}>
                        <Input 
                            placeholder="Search by name..." 
                            value={searchValue}
                            onChange={handleNameSearch} 
                            disableUnderline
                            sx={{
                                width: 'fit-content', 
                                color: colors.black,
                            }}
                        />
                        {searchValue && 
                            <Tooltip title="Clear Search" placement="top">
                                <IconButton onClick={handleClearSearch} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                    <Button 
                        variant="contained" 
                        onClick={handleAddData}
                        disabled={isAddingData}
                        sx={{
                            width: 'fit-content',
                            backgroundColor: isAddingData ? colors.moodyBlue : colors.azure
                        }}
                    >
                        {isAddingData ? 'Adding Data...' : 'Add Data to Table'}
                    </Button>
                </div>
                {isDataLoading ? <Loader /> : <Table1 table1Data={data} />}
            </main>
        </div>
    )
}