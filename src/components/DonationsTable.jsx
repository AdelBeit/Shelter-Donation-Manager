import { useEffect, useState } from "react";

import TableHeader from "@/components/TableHeader";
import TableRowSkeleton from "@/components/ghosts/TableRowSkeleton";
import { fetchDonations } from "@/lib/fetchDontaions";
import { sortByColumn } from "@/lib/sort";
import { getDate } from "@/lib/getDate";
import EditIcon from "@/assets/svg/Edit";
import CancelIcon from "@/assets/svg/Close";
import DoneIcon from "@/assets/svg/Done";
import DeleteIcon from "@/assets/svg/Delete";

export default function DonationsTable() {
  const [donations, setDonations] = useState([]);
  const [editID, setEditID] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorColumn, setErrorColumn] = useState(null);

  const updateDonations = () => fetchDonations(setDonations);
  const refreshState = () => {
    setErrorMessage("");
    setErrorColumn(null);
    setEditID(null);
  };
  // fetch donations from backend
  useEffect(() => {
    updateDonations();
  }, []);

  useEffect(() => {
    setDonations(sortByColumn(donations, sortColumn, sortOrder));
  }, [sortColumn, sortOrder]);

  // whenever donations is updated clear all errors and edit states
  useEffect(() => {
    refreshState();
  }, [donations]);

  // when you click on a column it will sort that column in asc order, if you click the same column again it will alternate between asc and desc order.
  // when you click on a different column at anypoint, restart sorting order to asc and sort that column with that order instead
  function sortHandler(col) {
    if (sortColumn === col) {
      if (sortOrder === "asc") setSortOrder("desc");
      else setSortOrder("asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  }

  // delete donations given their db id
  async function deleteDonationHandler(id) {
    try {
      const res = await fetch("/donations", {
        method: "DELETE",
        body: JSON.stringify({ id: id }),
      });
    } catch (err) {
      console.error(id, "deletion failed");
      setErrorMessage(err);
      return;
    }
    updateDonations();
  }

  // turn on edit mode for the respective table row
  function editDonationHandler(id) {
    setEditID(id);
  }

  // save edits on existing donations
  async function submitEditHandler(e, id) {
    setIsLoading(true);
    e.preventDefault();
    // get form data and put into FormData
    const row = document.querySelector(`#donation${id}`);
    const formData = new FormData();
    formData.append("donorName", row.querySelector("[name='donorName']").value);
    formData.append(
      "donationType",
      row.querySelector("[name='donationType']").value
    );
    formData.append("quantity", row.querySelector("[name='quantity']").value);
    formData.append("date", row.querySelector("[name='date']").value);
    formData.append("id", id);
    // update db with PUT
    try {
      const res = await fetch("/donations", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        setErrorMessage(`Update failed: ${errData.error}`);
        setErrorColumn(errData.col || "all");
        setIsLoading(false);
        return;
      }
      setEditID(null);
      updateDonations();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(`Update ${id} failed: ${err.message}`);
      return;
    }
  }

  // turn off edit mode
  function cancelEditHandler() {
    setEditID(null);
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="table text-md md:text-xl w-full">
        {errorMessage && (
          <caption class="caption-top text-error text-sm text-left pl-4">
            {errorMessage}
          </caption>
        )}
        <thead className="text-xl">
          <tr>
            {[
              { name: "donor_name", text: "name" },
              { name: "donation_type", text: "type" },
              { name: "quantity", text: "quantity" },
              { name: "date", text: "date" },
            ].map((col) => (
              <TableHeader
                key={col.name}
                clickHandler={(e) => sortHandler(col["name"])}
                flipped={sortColumn === col["name"] && sortOrder === "asc"}
                extraClasses={sortColumn === col["name"] && "text-white"}
                colName={col["name"]}
                text={col.text}
              />
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.length === 0 ? (
            <TableRowSkeleton />
          ) : (
            donations.map((donation) => (
              <tr
                // donation db id is unique so it's good for react key
                key={donation["id"]}
                id={"donation" + donation["id"]}
                className="hover"
              >
                {/* table data should be editable when editID is not null */}
                {/* display submit/cancel buttons when in edit mode, otherwise edit/delete buttons */}
                {editID === donation["id"] ? (
                  <>
                    <td>
                      <input
                        name="donorName"
                        type="text"
                        placeholder="Full Name"
                        className={`input input-bordered capitalize w-full ${
                          errorColumn === "all" || errorColumn === "donor_name"
                            ? "input-error"
                            : ""
                        } basis-3/12 placeholder:opacity-[0.5]`}
                        defaultValue={donation["donor_name"]}
                      />
                    </td>
                    <td>
                      <select
                        defaultValue={donation["donation_type"]}
                        name="donationType"
                        className={`select select-bordered w-full ${
                          errorColumn === "all" ||
                          errorColumn === "donation_type"
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
                    </td>
                    <td>
                      <input
                        type="text"
                        name="quantity"
                        defaultValue={donation["quantity"]}
                        placeholder="Quantity"
                        className={`input input-bordered w-full ${
                          errorColumn === "all" || errorColumn === "quantity"
                            ? "input-error"
                            : ""
                        } basis-2/12 placeholder:opacity-[0.5]`}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className={`input input-bordered w-full ${
                          errorColumn === "all" || errorColumn === "date"
                            ? "input-error"
                            : ""
                        } basis-4/12 placeholder:opacity-[0.5]`}
                        name="date"
                        placeholder="12/30/2024"
                        defaultValue={getDate(donation["date"])}
                      />
                    </td>
                    <td className="flex gap-2 py-2">
                      <button
                        disabled={isLoading}
                        className="btn btn-success min-h-10 max-h-10 w-10 edit-done p-2"
                        aria-label="submit donation edits"
                        onClick={(e) => submitEditHandler(e, donation["id"])}
                      >
                        <DoneIcon />
                      </button>
                      <button
                        disabled={isLoading}
                        className="btn btn-error min-h-10 max-h-10 w-10 edit-cancel p-2"
                        onClick={(e) => cancelEditHandler(donation["id"])}
                        aria-label="cancel donation edits"
                      >
                        <CancelIcon />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* when not in edit mode, use plain text */}
                    <td className="capitalize">{donation["donor_name"]}</td>
                    <td className="capitalize">{donation["donation_type"]}</td>
                    <td>{donation["quantity"]}</td>
                    <td>{getDate(donation["date"])}</td>
                    <td className="flex gap-2 py-2">
                      <button
                        className="btn btn-warning min-h-10 max-h-10 w-10 edit p-2"
                        aria-label="edit donation"
                        onClick={(e) => editDonationHandler(donation["id"])}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="btn btn-error min-h-10 max-h-10 w-10 delete p-2"
                        onClick={(e) => deleteDonationHandler(donation["id"])}
                        aria-label="delete donation"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
