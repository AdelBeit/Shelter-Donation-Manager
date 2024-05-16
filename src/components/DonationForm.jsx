import { getDate } from "@/lib/getDate";

export default function DonationForm() {
  return (
    <>
      <div className="text-sm p-4 text-left w-full flex flex-col gap-5">
        <label className="pl-2">Donation Form</label>
        <form action={"/donations"} method="POST" className="flex gap-5 w-full">
          <input
            id="nameField"
            name="donorName"
            type="text"
            placeholder="Full Name"
            className="input input-bordered capitalize w-full max-w-xs basis-3/12"
          />
          <select
            defaultValue={""}
            name="donationType"
            className="select select-bordered w-full max-w-xs basis-3/12"
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
            className="input input-bordered capitalize w-full max-w-xs basis-2/12"
          />
          <input
            type="date"
            id="start"
            className="input input-bordered capitalize w-full max-w-xs basis-4/12"
            name="date"
            placeholder="12/30/2024"
            defaultValue={getDate()}
          />

          <button type="submit" className="btn btn-success text-white">
            Donate
          </button>
        </form>
      </div>
    </>
  );
}
