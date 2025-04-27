import { MongoClient } from 'mongodb';
const uri = process.env.MONGO_DB;
let client;
export async function POST(req) {
    try {
        if (!client) {
            client = new MongoClient(uri);
        }
        const userData = await req.json(); 
        // console.log(userData,"userData")
        await client.connect();
        const db = client.db("BUDGET-TRACKER");
        const usersCollection = db.collection("Add_Items");
        const result = await usersCollection.insertOne(userData);
        return new Response(
            JSON.stringify({ message: "User added successfully", insertedId: result.insertedId }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
    } finally {
        await client.close();
    }
}

