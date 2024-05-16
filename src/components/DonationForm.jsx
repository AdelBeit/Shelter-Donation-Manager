import { getDate } from "@/lib/getDate";
import { useState } from "react";

export default function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorColumn, setErrorColumn] = useState(null);

  async function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    let formData = e.target[0].form;
    try {
      const res = await fetch("/donations", {
        method: "POST",
        body: new FormData(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorColumn(errData.col || "all");
        setErrorMessage(errData.error);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      window.location.reload();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
      return;
    }
  }

  return (
    <>
      <div className="text-sm p-4 text-left w-full flex flex-col gap-5">
        <label className="pl-2">Donation Form</label>
        <form
          onSubmit={submitHandler}
          method="POST"
          className="flex gap-5 w-full"
        >
          <input
            id="nameField"
            name="donorName"
            type="text"
            placeholder="Full Name"
            className={`input input-bordered capitalize w-full max-w-xs ${
              errorColumn === "all" || errorColumn === "donor_name"
                ? "input-error"
                : ""
            } basis-3/12 placeholder:opacity-[0.5]`}
          />
          <select
            defaultValue={""}
            name="donationType"
            className={`select select-bordered w-full max-w-xs ${
              errorColumn === "all" || errorColumn === "donation_type"
                ? "select-error"
                : ""
            } basis-3/12`}
          >
            <option value="" className="hidden">
              Donation Type
            </option>
            <option value="money">Money</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
          </select>
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            className={`input input-bordered w-full max-w-xs ${
              errorColumn === "all" || errorColumn === "quantity"
                ? "input-error"
                : ""
            } basis-2/12 placeholder:opacity-[0.5]`}
          />
          <input
            type="date"
            id="start"
            className={`input input-bordered w-full max-w-xs ${
              errorColumn === "all" || errorColumn === "date"
                ? "input-error"
                : ""
            } basis-4/12 placeholder:opacity-[0.5]`}
            name="date"
            placeholder="12/30/2024"
            defaultValue={getDate()}
          />

          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-success text-white"
          >
            Donate
          </button>
        </form>
        {errorMessage && <label className="text-error">{errorMessage}</label>}
      </div>
    </>
  );
}
