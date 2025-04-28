import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_DB;
let client = new MongoClient(uri);

async function updateUser(_id, updatedFields) {
    try {
        const database = client.db('BUDGET-TRACKER');
        const usersCollection = database.collection('Add_Items');

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(_id) }, // 🔥 update based on _id
            { $set: updatedFields }
        );

        if (result.matchedCount === 0) {
            console.log('No matching document found.');
            throw new Error('User not found');
        }

        return await usersCollection.findOne({ _id: new ObjectId(_id) });
    } catch (error) {
        console.error('Error updating user in database:', error);
        throw error;
    }
}

export async function PUT(req) {
    try {
        if (!client.topology?.isConnected()) {
            await client.connect();
        }

        const body = await req.json();
        const { _id, ...updatedFields } = body;

        // console.log(_id, "Updated fields received");

        if (!_id) {
            return NextResponse.json({ message: '_id is required' }, { status: 400 });
        }

        const updatedUser = await updateUser(_id, updatedFields);

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT handler:', error.message);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
