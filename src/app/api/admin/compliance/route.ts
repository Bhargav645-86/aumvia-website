import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("aumvia");
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    const query: any = {};
    if (region) query.region = region;
    if (type) query.type = type;
    if (category) query.category = category;

    let items = await db
      .collection("compliance_library")
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    if (items.length === 0) {
      const defaultItems = [
        {
          title: "UK Employment Law - Working Hours",
          region: "UK",
          type: "law",
          category: "employment",
          content:
            "Maximum 48 hours per week average (over 17 weeks). Workers can opt out voluntarily.",
          references: ["Working Time Regulations 1998"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "UK Break Rules",
          region: "UK",
          type: "break",
          category: "employment",
          content:
            "Workers are entitled to one uninterrupted 20-minute rest break if working more than 6 hours.",
          references: ["Working Time Regulations 1998"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "National Minimum Wage Rates 2024",
          region: "UK",
          type: "law",
          category: "wages",
          content:
            "National Living Wage (21+): £11.44/hr. 18-20: £8.60/hr. Under 18: £6.40/hr. Apprentice: £6.40/hr.",
          references: ["National Minimum Wage Act 1998"],
          version: "2024.1",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Holiday Entitlement",
          region: "UK",
          type: "hours",
          category: "leave",
          content:
            "Full-time workers are entitled to 5.6 weeks (28 days) paid holiday per year. Part-time is pro-rata.",
          references: ["Working Time Regulations 1998"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Right to Work Checks",
          region: "UK",
          type: "compliance",
          category: "onboarding",
          content:
            "Employers must check documents proving right to work in UK before employment starts. Retain copies for 2 years after employment ends.",
          references: ["Immigration, Asylum and Nationality Act 2006"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "GDPR Data Protection",
          region: "UK",
          type: "compliance",
          category: "data",
          content:
            "Personal data must be processed lawfully, fairly and transparently. Data subjects have rights including access, rectification, and erasure.",
          references: ["UK GDPR", "Data Protection Act 2018"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Food Safety Requirements",
          region: "UK",
          type: "compliance",
          category: "food_safety",
          content:
            "Food handlers must have appropriate training. Businesses must implement HACCP principles and maintain hygiene standards.",
          references: ["Food Safety Act 1990", "Food Hygiene Regulations"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Health and Safety at Work",
          region: "UK",
          type: "compliance",
          category: "health_safety",
          content:
            "Employers must ensure health, safety and welfare of employees. Risk assessments required. First aid provision mandatory.",
          references: ["Health and Safety at Work Act 1974"],
          version: "1.0",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await db.collection("compliance_library").insertMany(defaultItems);
      items = defaultItems;
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching compliance items:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("aumvia");
    const body = await request.json();

    const item = {
      ...body,
      version: "1.0",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("compliance_library").insertOne(item);
    const newItem = await db
      .collection("compliance_library")
      .findOne({ _id: result.insertedId });

    await db.collection("audit_logs").insertOne({
      action: "create_compliance_item",
      targetType: "compliance",
      targetId: result.insertedId.toString(),
      details: `Compliance item created: ${item.title}`,
      performedBy: "Admin",
      createdAt: new Date(),
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error creating compliance item:", error);
    return NextResponse.json(
      { error: "Failed to create compliance item" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("aumvia");
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Compliance item ID required" },
        { status: 400 },
      );
    }

    const current = await db
      .collection("compliance_library")
      .findOne({ _id: new ObjectId(_id) });
    if (current) {
      const versionParts = (current.version || "1.0").split(".");
      const newMinor = parseInt(versionParts[1] || "0") + 1;
      updateData.version = `${versionParts[0]}.${newMinor}`;
    }

    updateData.updatedAt = new Date();

    await db
      .collection("compliance_library")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    const updatedItem = await db
      .collection("compliance_library")
      .findOne({ _id: new ObjectId(_id) });

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Compliance item not found" },
        { status: 404 },
      );
    }

    await db.collection("audit_logs").insertOne({
      action: "update_compliance_item",
      targetType: "compliance",
      targetId: _id,
      details: `Compliance item updated: ${updatedItem.title} (v${updateData.version})`,
      performedBy: "Admin",
      createdAt: new Date(),
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating compliance item:", error);
    return NextResponse.json(
      { error: "Failed to update compliance item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("aumvia");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Compliance item ID required" },
        { status: 400 },
      );
    }

    const item = await db
      .collection("compliance_library")
      .findOne({ _id: new ObjectId(id) });

    await db
      .collection("compliance_library")
      .deleteOne({ _id: new ObjectId(id) });

    await db.collection("audit_logs").insertOne({
      action: "delete_compliance_item",
      targetType: "compliance",
      targetId: id,
      details: `Compliance item deleted: ${item?.title}`,
      performedBy: "Admin",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting compliance item:", error);
    return NextResponse.json(
      { error: "Failed to delete compliance item" },
      { status: 500 },
    );
  }
}
