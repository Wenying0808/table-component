import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table1Model from "@/app/models/Table1";
import { MongoTableDataQuery } from "@/app/types/DataTypes";

export async function GET(request: Request) {
    try{
        await connectToMongoDB();

        const { searchParams } = new URL(request.url);
        //query object
        const query: MongoTableDataQuery = {};

        // name filter
        const nameFilter = searchParams.get('name');
        if (nameFilter) {
            query.name = { $regex: nameFilter, $options: 'i'};
        }
        
        // status filter
        const statusQuery = searchParams.get('status');
        if (statusQuery && statusQuery !== 'All') {
             query.status = statusQuery as 'Queued' | 'Running' | 'Completed' | 'Failed';
        }

        // user filter
        const userQuery = searchParams.get('user');
        if (userQuery && userQuery !== 'All') {
            query.user = userQuery;
        }

        // date filter
        /*const dateQuery = searchParams.get('date');
        if (dateQuery) {
            query.date = { $gte: new Date(dateQuery), $lte: new Date(dateQuery) };
        }*/

        // isArchived filter
        const isArchivedFilter = searchParams.get('isArchived');
        if (isArchivedFilter) {
            query.isArchived = isArchivedFilter === 'true';
        }

        console.log("table1query:", query);
        const table1Data = await Table1Model.find(query);
        return NextResponse.json(table1Data);
    } catch (error) {
        return NextResponse.json({ message: 'Table1:  Failed to fetch table data', error })
    }
}

export async function POST(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();
        // validate the required data
        if (!body.name || !body.status || !body.user){
            return NextResponse.json({ message: 'Table1: Missing required data to post' });
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
            throw new Error('Table1: Document insertion failed');
        }
    } catch (error) {
        return NextResponse.json({ message: 'Table1: Failed to add new analysis data', error });
    }
}

export async function PATCH() {
    try {
        await connectToMongoDB();
        const result = await Table1Model.updateMany(
            { isArchived: { $exists: false } },
            { $set: { isArchived: false } }
        );
        
        return NextResponse.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} documents with isArchived field` 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update documents', error },
            { status: 500 }
        );
    }
}