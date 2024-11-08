"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table1 from "@/app/components/table/Table1";
import { useEffect, useState } from "react";

export default function Table1Page() {
    const [data, setData] = useState([]);

    const handleFetchData = async () => {
        const response = await fetch('/pages/api/table1');
        const table1 = await response.json();
        console.log(table1);
        return table1;
    }

    useEffect(() => {
        handleFetchData().then((d) => setData(d));
    }, []);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <h1>Table 1</h1>
                <Table1 table1Data={data} />
                {data.length>0 && JSON.stringify(data, null, 2)}
            </main>
        </div>
    )
}