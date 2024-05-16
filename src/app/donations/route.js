import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await sql`select * from donations order by id desc`;
  return NextResponse.json(rows);
}

export async function POST(request) {
  const formData = await request.formData();
  const donorName = formData.get("donorName");
  const donationType = formData.get("donationType");
  const quantity = formData.get("quantity");
  const date = formData.get("date");

  if (!donorName || donorName.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid name", col: "donor_name" },
      { status: 400 }
    );
  }
  if (!donationType || donationType.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid donation type", col: "donation_type" },
      { status: 400 }
    );
  }
  if (!quantity || isNaN(parseInt(quantity))) {
    return NextResponse.json(
      { error: "Invalid quantity", col: "quantity" },
      { status: 400 }
    );
  }
  if (!date) {
    return NextResponse.json(
      { error: "Invalid date", col: "date" },
      { status: 400 }
    );
  }

  try {
    const { rows } =
      await sql`INSERT INTO donations (donor_name, donation_type, quantity, date) VALUES (${donorName}, ${donationType}, ${quantity}, ${date})`;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  redirect("/");
}

// update donation by overwridding everything for given donation id
export async function PUT(request) {
  const formData = await request.formData();
  const donorName = formData.get("donorName");
  const donationType = formData.get("donationType");
  const quantity = formData.get("quantity");
  const date = formData.get("date");
  const id = formData.get("id");

  // validations
  if (donorName.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid name", col: "donor_name" },
      { status: 400 }
    );
  }

  if (donationType.trim().length === 0) {
    return NextResponse.json(
      { error: "Invalid donation type", col: "donation_type" },
      { status: 400 }
    );
  }

  if (isNaN(parseInt(quantity))) {
    return NextResponse.json(
      { error: "Invalid quantity", col: "quantity" },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: "Invalid date", col: "date" },
      { status: 400 }
    );
  }

  try {
    const { rows } =
      await sql`UPDATE donations set donor_name=${donorName}, donation_type=${donationType}, quantity=${quantity}, date=${date} where id=${id}`;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  return NextResponse.json({ message: `updated donation ${id}` });
}

// delete donation using db id
export async function DELETE(request) {
  const body = await request.json();
  const id = body.id;
  try {
    await sql`DELETE from donations where id=${id}`;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  return NextResponse.json({ message: "deletion complete" });
}
