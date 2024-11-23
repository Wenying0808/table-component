import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Table2Model from '@/app/models/Table2';

export async function GET() {
    try {
        await connectToMongoDB();

        const countBefore = await Table2Model.countDocuments({ isArchived: { $exists: false } });
        console.log(`Documents without isArchived: ${countBefore}`);

        const result = await Table2Model.collection.updateMany(
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