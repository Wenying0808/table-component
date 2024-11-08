"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table1 from "@/app/components/table/Table1";


export default function Table1Page() {
    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <h1>Table 1</h1>
                <Table1 />
            </main>
        </div>
    )
}