import Account from "@/app/models/Finance";
import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        await connectToMongoDB();
        const accounts = await Account.find({});
        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch finance data', error })
    }
}