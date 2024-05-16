import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await sql`select * from donations`;
  return NextResponse.json(rows);
}

export async function POST(request) {
  const formData = await request.formData();
  const donorName = formData.get("donorName");
  const donationType = formData.get("donationType");
  const quantity = formData.get("quantity");
  const date = formData.get("date");

  if (!donorName || donorName.trim().length === 0) {
    throw new Error("Please enter your name");
  }
  if (!donationType || donationType.trim().length === 0) {
    throw new Error("Please select a donation type");
  }
  if (!quantity || isNaN(parseInt(quantity))) {
    throw new Error("Please enter a valid quantity");
  }
  if (!date) {
    throw new Error("Please select a date");
  }

  try {
    const { rows } =
      await sql`INSERT INTO donations (donor_name, donation_type, quantity, date) VALUES (${donorName}, ${donationType}, ${quantity}, ${date})`;
  } catch (err) {
    throw new Error(err);
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
    throw new Error("Please enter your name");
  }

  if (donationType.trim().length === 0) {
    throw new Error("Please select a donation type");
  }

  if (isNaN(parseInt(quantity))) {
    throw new Error("Please enter a valid quantity");
  }

  if (!date) {
    throw new Error("Please select a date");
  }

  try {
    const { rows } =
      await sql`UPDATE donations set donor_name=${donorName}, donation_type=${donationType}, quantity=${quantity}, date=${date} where id=${id}`;
  } catch (err) {
    throw new Error(err);
  }
  return Response.json({ message: `updated donation ${id}` });
}

// delete donation using db id
export async function DELETE(request) {
  const body = await request.json();
  const id = body.id;
  try {
    await sql`DELETE from donations where id=${id}`;
  } catch (err) {
    throw new Error(err);
  }
  return Response.json({ message: "deletion complete" });
}
