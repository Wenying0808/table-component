"use client";

import Navbar from "@/app/components/navbar/navbar";
import Table2 from "@/app/components/table/Table2";


export default function Table2Page() {
    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <h1>Table 2</h1>
                <Table2 />
            </main>
        </div>
    )
}