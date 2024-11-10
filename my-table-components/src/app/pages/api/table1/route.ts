import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table1Model from "@/app/models/Table1";

export async function GET(request: Request) {
    try{
        await connectToMongoDB();
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('search');
        let query = {};
        if (searchQuery) {
            query = { name: { $regex: searchQuery, $options: 'i' } };
        }
        const table1Data = await Table1Model.find(query);
        return NextResponse.json(table1Data);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch finance data', error })
    }
}

export async function POST(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();
        // validate the required data
        if (!body.name || !body.status || !body.user){
            return NextResponse.json({ message: 'Missing required data' });
        }
        const newDocument = {
            ...body,
            updatedTime: new Date().toISOString(),
            actions: body.actions || [],
            duration: body.duration || "",
        }
        const result = await Table1Model.collection.insertOne(newDocument);
        if (result.acknowledged) {
            // If insertion was successful, fetch the newly inserted document
            const insertedDocument = await Table1Model.findOne({ _id: result.insertedId });
            return NextResponse.json(insertedDocument, { status: 201 });
        } else {
            throw new Error('Document insertion failed');
        }
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add new analysis data', error });
    }
}