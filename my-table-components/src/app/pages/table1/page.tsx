"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table1 from "@/app/components/table/Table1";
import { useEffect, useState } from "react";

export default function Table1Page() {
    const [account, setAccount] = useState([]);

    const handleFetchData = async () => {
        const response = await fetch('/pages/api/finance');
        const account = await response.json();
        console.log(account);
        return account;
    }


    useEffect(() => {
        handleFetchData().then((accounts) => setAccount(accounts));
    }, []);

    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <h1>Table 1</h1>
                {account.length>0 && JSON.stringify(account, null, 2)}
                <Table1 />
            </main>
        </div>
    )
}