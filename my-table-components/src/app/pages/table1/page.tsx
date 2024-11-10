"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table1 from "@/app/components/table/Table1";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { colors } from "@/app/styles/colors";

export default function Table1Page() {
    const [data, setData] = useState([]);
    const [isAddingData, setIsAddingData] = useState(false);

    const handleFetchData = async () => {
        const response = await fetch('/pages/api/table1');
        const table1 = await response.json();
        console.log("Fetched table1 data from db",table1);
        return table1;
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

    useEffect(() => {
        handleFetchData().then((d) => setData(d));
    }, []);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
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
                <Table1 table1Data={data} />
            </main>
        </div>
    )
}