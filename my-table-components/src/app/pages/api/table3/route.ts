import connectToMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Table3Model from "@/app/models/Table3";
import { MongoTableDataQuery } from "@/app/types/DataTypes";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
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
        if (statusQuery && statusQuery !== 'All Status') {
            query.status = statusQuery as 'Queued' | 'Running' | 'Completed' | 'Failed';
        }

        // user filter
        const userQuery = searchParams.get('user');
        if (userQuery && userQuery !== 'All Users') {
            // my analyses, my name is "John Doe"
            query.user = 'John Doe';
        }

        // isArchived filter
        const isArchivedQuery = searchParams.get('isArchived');
        if (isArchivedQuery) {
            query.isArchived = isArchivedQuery === 'true';
        }

        // date filter
        const timeRangeQuery = searchParams.get('timeRange');
        let timeRangeFilter={};
        if (timeRangeQuery && timeRangeQuery !== 'All Time') {
            const now = new Date();
            switch (timeRangeQuery) {
                case 'Today':
                    timeRangeFilter = { 
                        updatedTime: { 
                            $gte: startOfDay(now).toISOString()
                        } 
                    };
                    break;
                case 'This Week':
                    timeRangeFilter = {
                        updatedTime: {
                            $gte: startOfWeek(now).toISOString()
                        }
                    };
                    break;
                case 'This Month':
                    timeRangeFilter = {
                        updatedTime: {
                            $gte: startOfMonth(now).toISOString()
                        }
                    };
                    break;
            }
        }
        const combinedQuery = { ...query, ...timeRangeFilter };        
        
        console.log("table3query:", combinedQuery);
        const table3Data = await Table3Model.find(combinedQuery);
        return NextResponse.json(table3Data);
    } catch (error) {
        return NextResponse.json({ message: 'Table3:  Failed to fetch table data', error })
    }
}

export async function POST(request: Request) {
    try {
        await connectToMongoDB();
        const body = await request.json();
        // validate the required data
        if (!body.name || !body.status || !body.user){
            return NextResponse.json({ message: 'Table3: Missing required data to post' });
        }
        const newDocument = {
            ...body,
            updatedTime: new Date().toISOString(),
            actions: body.actions || [],
            duration: body.duration || "",
        }
        const result = await Table3Model.collection.insertOne(newDocument);
        if (result.acknowledged) {
            // If insertion was successful, fetch the newly inserted document
            const insertedDocument = await Table3Model.findOne({ _id: result.insertedId });
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
        const result = await Table3Model.collection.updateMany(
            { _id: { $in: objectIds } },
            { $set: { isArchived: action === 'archive' } }
        );
        
        /*console.log("result:", result);*/

        return NextResponse.json({ 
            message: `Table3: Successfully ${action}ed documents`,
            modifiedCount: result.modifiedCount
        });
       
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Table3: Failed to update documents', error },
            { status: 500 }
        );
    }
}