"use client";
import React from "react";
import DonationsTable from "@/components/DonationsTable";
import DonationForm from "@/components/DonationForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col m-auto items-center gap-5 md:p-18 p-8 w-full lg:w-5/6">
      <DonationForm />
      <DonationsTable />
    </main>
  );
}
