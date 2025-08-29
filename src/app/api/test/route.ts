import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("aumvia"); // database name
    const collections = await db.listCollections().toArray();

    return NextResponse.json({ ok: true, collections });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e });
  }
}
