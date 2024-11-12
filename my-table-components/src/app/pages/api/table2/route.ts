import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table2Model from "@/app/models/Table2";

export async function GET(request: Request) {
    try{
        await connectToMongoDB();
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('search');
        let query = {};
        if (searchQuery) {
            query = { name: { $regex: searchQuery, $options: 'i' } };
        }
        const table2Data = await Table2Model.find(query);
        return NextResponse.json(table2Data);
    } catch (error) {
        return NextResponse.json({ message: 'Table2:  Failed to fetch table data', error })
    }
}

export async function POST(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();
        // validate the required data
        if (!body.name || !body.status || !body.user){
            return NextResponse.json({ message: 'Table2: Missing required data to post' });
        }
        const newDocument = {
            ...body,
            updatedTime: new Date().toISOString(),
            actions: body.actions || [],
            duration: body.duration || "",
        }
        const result = await Table2Model.collection.insertOne(newDocument);
        if (result.acknowledged) {
            // If insertion was successful, fetch the newly inserted document
            const insertedDocument = await Table2Model.findOne({ _id: result.insertedId });
            return NextResponse.json(insertedDocument, { status: 201 });
        } else {
            throw new Error('Table2: Document insertion failed');
        }
    } catch (error) {
        return NextResponse.json({ message: 'Table2: Failed to add new analysis data', error });
    }
}