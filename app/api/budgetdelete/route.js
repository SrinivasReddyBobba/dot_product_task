
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_DB;
let client;

export async function DELETE(req) {
    try {
        if (!client) {
            client = new MongoClient(uri);
        }
        const { _id } = await req.json();
        // console.log("_id to delete:", _id);
        if (!_id) {
            return new Response(
                JSON.stringify({ error: "Missing _id in request body" }),
                { status: 400 }
            );
        }
        await client.connect();
        const db = client.db("BUDGET-TRACKER");
        const usersCollection = db.collection("Add_Budget");
        const result = await usersCollection.deleteOne({ _id: new ObjectId(_id) });
        if (result.deletedCount === 0) {
            return new Response(
                JSON.stringify({ error: "User not found or already deleted" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "User deleted successfully" }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete user' }),
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}
