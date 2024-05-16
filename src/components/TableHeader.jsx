import DropdownIcon from "@/assets/svg/Dropdown";

export default function TableHeader({
  text,
  flipped,
  extraClasses,
  clickHandler,
}) {
  return (
    <th className={`hover:text-white ${extraClasses}`}>
      <button
        className="w-full h-full flex justify-between items-center capitalize"
        onClick={clickHandler}
      >
        {text}
        <span className={`size-6 mt-1 ${!flipped && "-scale-y-100"}`}>
          <DropdownIcon />
        </span>
      </button>
    </th>
  );
}
