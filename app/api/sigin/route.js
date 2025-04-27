import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_DB;
const client = new MongoClient(uri);
export async function POST(req) {
  try {
    const { userName, password } = await req.json(); 

    if (!userName || !password) {
      return NextResponse.json({ message: "Missing username or password" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("BUDGET-TRACKER");
    const usersCollection = db.collection("Login_Credentials");

    const user = await usersCollection.findOne({ userName, password });

    if (user) {
      if (user.userstatus === 'Active') {
        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
      } else {
        return NextResponse.json({ message: " Your account Logins are inactive status.Please contact admin.", user }, { status: 403 });
      }
    } else {
      return NextResponse.json({ message: "Wrong credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}