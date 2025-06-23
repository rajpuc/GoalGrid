import React, { useEffect } from "react";
import images from "../../assets/images";
import useAuthenticationStore from "../../store/useAuthenticationStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUser, LogOut, ListFilter } from "lucide-react";
import useRoadmapItemStore from "../../store/useRoadmapItemStore";
const Navbar = () => {
  const { loggedInUser, logout } = useAuthenticationStore();
  const {
    categories,
    statuses,
    data,
    updateData,
    clearData,
    fetchUniqueFilters,
    fetchFilteredRoadmapItems,
    total,
    resetRoadmapItems,
    incrementPage,
    page,
    updatePage,
  } = useRoadmapItemStore();
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const handleLogout = async () => {
    const isSuccess = await logout();
    if (isSuccess) navigate("/login");
  };
  const handleFilter = async () => {
    setShowDropDown(false);
    setShowFilter(!showFilter);
  };
  useEffect(() => {
    if (showFilter) {
      clearData();
      updatePage(1);
      fetchUniqueFilters();
    }
  }, [showFilter]);

  const submitFilter = async () => {
    updatePage(1);
    resetRoadmapItems();
    await fetchFilteredRoadmapItems(data, 1);
    incrementPage();
  };

  const clearFilterHandler = async () => {
    clearData();
    const data= { limit:14, status:'', category:'', sortBy:'', search:'' };
    await fetchFilteredRoadmapItems(data, 1); 
    updatePage(2)
  };

  return (
    <nav className="bg-blue-200 sticky top-0 ">
      <div className="w-full px-3 cm-xmd:px-0 cm-xmd:w-4/5 mx-auto flex items-center justify-between">
        <div className="w-12 h-12 bg-cm-global/70 rounded-full">
          <img className="w-full h-full scale-120" src={images.logo} alt="" />
        </div>
        <div className="flex items-center gap-3">
          {data.category || data.status || data.sortBy || data.search ? (
            <button
              className="text-sm border-white p-1 px-2 rounded-sm cursor-pointer bg-blue-700 text-white border-2"
              onClick={clearFilterHandler}
            >
              Clear Filter
            </button>
          ) : null}
          <div className="relative">
            <button onClick={handleFilter} className="flex ">
              <ListFilter />
            </button>
            <div
              className={`shadow-md rounded-md px-4 transition-[max-height,padding-top,padding-bottom]  duration-300 ease-in-out bg-blue-200  w-90 absolute right-0 top-[calc(100%+14px)] overflow-hidden ${
                showFilter ? "max-h-[600px] py-4" : "max-h-0 py-0"
              }`}
            >
              <div className="flex flex-col gap-1.5 mt-3">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={data.search}
                  onChange={(e) => updateData("search", e.target.value)}
                  className="border bg-white focus:outline-none border-gray-300 rounded px-2 py-1 text-sm"
                />

                {/* Category Dropdown */}
                <div className="flex items-center justify-between">
                  <label className="text-[12px] " htmlFor="">
                    Select Categories:
                  </label>
                  <select
                    name="category"
                    value={data.category}
                    onChange={(e) => updateData("category", e.target.value)}
                    className="border max-w-50 w-full bg-white focus:outline-none focus:border-blue-700 border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center justify-between">
                  <label className="text-[12px] " htmlFor="">
                    Select Status:
                  </label>
                  <select
                    name="status"
                    value={data.status}
                    onChange={(e) => updateData("status", e.target.value)}
                    className="border max-w-50 w-full bg-white focus:outline-none focus:border-blue-700 border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center justify-between">
                  <label className="text-[12px] " htmlFor="">
                    Select Sort by:
                  </label>
                  <select
                    name="sortBy"
                    value={data.sortBy}
                    onChange={(e) => updateData("sortBy", e.target.value)}
                    className="border w-full max-w-50 bg-white focus:outline-none focus:border-blue-700 border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">Recent</option>
                    <option value="popularity">Popularity</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={submitFilter}
                  className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-sm flex items-center gap-2 hover:bg-blue-700"
                >
                  <LogOut size={16} /> <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                setShowFilter(false);
                setShowDropDown(!showDropDown);
              }}
              className="w-10 h-10 rounded-full flex overflow-hidden"
            >
              <img
                className="object-cover w-full h-full"
                src={
                  loggedInUser?.profileImageUrl
                    ? loggedInUser.profileImageUrl
                    : images.avatar
                }
                alt="profile image"
              />
            </button>
            <div
              className={`shadow-md rounded-md px-4 transition-[max-height,padding-top,padding-bottom]  duration-300 ease-in-out bg-blue-200  w-50 absolute right-0 top-[calc(100%+6px)] overflow-hidden ${
                showDropDown ? "max-h-[200px] py-4" : "max-h-0 py-0"
              }`}
            >
              <h1 className="w-full text-center font-medium">
                {loggedInUser.fullName}
              </h1>
              <div className="flex flex-col gap-1.5 mt-3">
                <Link className="cursor-pointer px-1 bg-white py-1 rounded-sm flex items-center gap-2 hover:bg-gray-100">
                  <CircleUser size={16} /> <span>Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer px-1 bg-white py-1 rounded-sm flex items-center gap-2 hover:bg-gray-100"
                >
                  <LogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
