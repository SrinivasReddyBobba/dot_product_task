import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_DB;
let client = new MongoClient(uri);

async function updateUser(userName, updatedFields) {
    try {
        const database = client.db('BUDGET-TRACKER');
        const usersCollection = database.collection('Add_Budget');

        const result = await usersCollection.updateOne(
            { userName: userName },
            { $set: updatedFields }
        );

        if (result.matchedCount === 0) {
            console.log('No matching user found.');
            throw new Error('User not found');
        }

        return await usersCollection.findOne({ userName: userName });
    } catch (error) {
        console.error('Error updating user in database:', error);
        throw error;
    }
}

export async function PUT(req) {
    try {
        if (!client.topology?.isConnected()) {
            await client.connect(); // Only connect if not already connected
        }

        const body = await req.json();
        const { userName, ...updatedFields } = body;

        console.log(updatedFields, "Updated fields received");

        if (!userName) {
            return NextResponse.json({ message: 'userName is required' }, { status: 400 });
        }

        const updatedUser = await updateUser(userName, updatedFields);

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error in PUT handler:', error.message);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
