import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Table3Model from '@/app/models/Table3';

export async function GET() {
    try {
        await connectToMongoDB();

        const countBefore = await Table3Model.countDocuments({ isArchived: { $exists: false } });
        console.log(`Documents without isArchived: ${countBefore}`);

        const result = await Table3Model.collection.updateMany(
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