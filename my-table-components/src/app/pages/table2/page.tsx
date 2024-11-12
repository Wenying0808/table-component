"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table2 from "@/app/components/table/Table2";
import { useEffect, useState } from "react";


export default function Table2Page() {
    const [table2Data, setTable2Data] = useState([]);

    const handleFetchData = async () => {
        const response = await fetch('/pages/api/table2');
        const data = await response.json();
        setTable2Data(data);
    }
    
    useEffect(() => {
        handleFetchData();
    }, []);

    console.log("table2Data:", table2Data);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <Table2 />
            </main>
        </div>
    )
}