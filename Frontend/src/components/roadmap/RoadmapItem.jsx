import React, { useRef } from "react";
import useRoadmapItemStore from "../../store/useRoadmapItemStore";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";
import { useState } from "react";
import {
  ArrowBigUp,
  MessageSquare,
  BookOpenText,
  ExternalLink,
} from "lucide-react";
import useAuthenticationStore from "../../store/useAuthenticationStore";
import RoadmapDetailsModal from "./RoadmapDetailsModal";

const RoadmapItem = () => {
  const {
    roadmapItems,
    fetchRoadmapItems,
    isRoadmapItemFatching,
    hasMore,
    toggleUpvote,
    statuses,
    categories,
    fetchUniqueFilters,
    fetchFilteredRoadmapItems,
    data,
    updateData,
    clearData,
    incrementPage,
    page,
    updatePage,
  } = useRoadmapItemStore();

  const { loggedInUser } = useAuthenticationStore();
  const hasFetchedRef = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const loadMoreRoadmapItems = async () => {
    await fetchFilteredRoadmapItems(data, page);
    incrementPage();
    if (!hasMore) updatePage(1);
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    updatePage(1);
    loadMoreRoadmapItems();
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={roadmapItems.length}
        next={loadMoreRoadmapItems}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading more items...</p>}
        endMessage={
          <p className="text-center text-gray-500 py-4">
            You've reached the end!
          </p>
        }
      >
        <div className="w-full mt-5">
          <div className="w-full px-3 cm-xmd:px-0  cm-xmd:w-4/5 mx-auto grid grid-cols-1 cm-xsm:grid-cols-2 gap-5 ">
            {roadmapItems.map((item) => (
              <div
                key={item._id}
                className="w-full bg-white p-3 px-4  rounded-3xl shadow"
              >
                <div className="w-full bg-gray-200/50 p-0.5 ">
                  <p className="text-sm">{item.title}</p>
                </div>
                <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                  <div className="flex items-center ">
                    <button
                      className="cursor-pointer"
                      onClick={() => toggleUpvote(item._id)}
                      disabled={!loggedInUser}
                    >
                      {" "}
                      <ArrowBigUp
                        className={`${
                          item.upvotes?.includes(loggedInUser._id)
                            ? "text-blue-700"
                            : ""
                        }`}
                        size={24}
                      />{" "}
                    </button>
                    <span className="text-sm">({item.upvotes.length})</span>
                  </div>
                  <div className="flex items-center">
                    <button>
                      <MessageSquare size={20} />
                    </button>
                    <span className="text-sm">({item.commentCount})</span>
                  </div>
                  <div
                    title="status"
                    className={`text-[12px] text-white ${
                      item.status === "Completed"
                        ? "bg-green-700"
                        : item.status === "Todo"
                        ? "bg-red-400 "
                        : "bg-amber-400"
                    } px-2 py-0.5 rounded-2xl`}
                  >
                    {item.status}
                  </div>
                  <div
                    title="category"
                    className={`text-[12px] bg-fuchsia-800  text-white px-2 py-0.5 rounded-2xl`}
                  >
                    {item.category}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedItemId(item._id);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1.5 cursor-pointer text-[12px] bg-blue-800 px-2 py-0.5 rounded-sm text-white"
                    >
                      <ExternalLink size={14} /> <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
      {showModal && (
        <RoadmapDetailsModal
          itemId={selectedItemId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default RoadmapItem;
