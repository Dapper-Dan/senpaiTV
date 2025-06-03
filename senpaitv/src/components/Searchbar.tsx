export default function Searchbar() {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <input type="text" placeholder="Search" className="bg-gray rounded-md p-2" />
      <button className="bg-gray rounded-md p-2">
        {/* <Image src={"/images/search.svg"} alt="search" width={20} height={20} /> */}
      </button>
    </div>
  );
}
