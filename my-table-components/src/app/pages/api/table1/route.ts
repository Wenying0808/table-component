import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table1Model from "@/app/models/Table1";

export async function GET() {
    try{
        await connectToMongoDB();
        const table1Data = await Table1Model.find({});
        return NextResponse.json(table1Data);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch finance data', error })
    }
}