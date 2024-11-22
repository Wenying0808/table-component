import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table2Model from "@/app/models/Table2";
import { MongoTableDataQuery } from "@/app/types/DataTypes";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try{
        await connectToMongoDB();
        const { searchParams } = new URL(request.url);

        // query object
        const query: MongoTableDataQuery = {};

        // name filter
        const nameQuery = searchParams.get('name');
        if (nameQuery) {
            query.name = { $regex: nameQuery, $options: 'i' };
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

        // isArchived filter
        const isArchivedQuery = searchParams.get('isArchived');
        if (isArchivedQuery) {
            query.isArchived = isArchivedQuery === 'true';
        }
        console.log("table2query:", query);
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

export async function PATCH(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();
        /*console.log("request patchbody:", body);*/
        const { ids, action } = body;

        if(!ids){
            return NextResponse.json({ message: 'Table1: Invalid or missing ids' });
        }
        if(!action){
            return NextResponse.json({ message: 'Table1: Invalid or missing action' });
        }
        //convert string ID to ObjectID
        const objectIds = ids.map((id: string) => new ObjectId(id));
        /*console.log("objectIds:", objectIds);*/

        // archive unarchived documents or unarchive archived documents
        const result = await Table2Model.collection.updateMany(
            { _id: { $in: objectIds } },
            { $set: { isArchived: action === 'archive' } }
        );
        
        /*console.log("result:", result);*/

        return NextResponse.json({ 
            message: `Table2: Successfully ${action}ed documents`,
            modifiedCount: result.modifiedCount
        });
       
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Table2: Failed to update documents', error },
            { status: 500 }
        );
    }
}