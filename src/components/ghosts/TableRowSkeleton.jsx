export default function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="p-4 bg-gray" colSpan="5">
        Loading...
      </td>
    </tr>
  );
}
