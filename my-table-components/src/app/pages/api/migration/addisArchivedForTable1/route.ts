import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Table1Model from '@/app/models/Table1';

export async function GET() {
    try {
        await connectToMongoDB();

        const countBefore = await Table1Model.countDocuments({ isArchived: { $exists: false } });
        console.log(`Documents without isArchived: ${countBefore}`);

        const result = await Table1Model.collection.updateMany(
            { isArchived: { $exists: false } },
            { $set: { isArchived: false } }
        );
        
        return NextResponse.json({ 
            success: true, 
            message: `Migration complete: Updated ${result.modifiedCount} documents` 
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json(
            { success: false, error: 'Migration failed' },
            { status: 500 }
        );
    }
}