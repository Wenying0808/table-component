import type { NextApiRequest, NextApiResponse } from 'next';
import connectToMongoDB from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Connect to MongoDB
      await connectToMongoDB();
      // Get the database instance
      const db = await connectToMongoDB();
      console.log("db", db);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: 'Table1: Error connecting to MongoDB', error });
    }
  }