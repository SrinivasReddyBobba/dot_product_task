


import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_DB;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    await client.connect();
    const db = client.db("BUDGET-TRACKER");
    const usersCollection = db.collection("Add_Items");
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get('userName'); 
    const users = await usersCollection.find({ userName: userName }).toArray();
    if (users.length > 0) {
      return NextResponse.json({ message: "Users found", users }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No users matched", users: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
