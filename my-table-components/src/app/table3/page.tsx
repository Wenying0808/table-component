"use client";

import Navbar from "../components/navbar/navbar";
import Table3 from "../components/table/Table3";

export default function Table3Page() {
    return (
        <div className="table-page">
            <Navbar />
            <main className="page-main">
                <h1>Table 3</h1>
                <Table3 />
            </main>
        </div>
    )
}