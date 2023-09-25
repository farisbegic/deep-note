"use client";

import React, { useState } from "react";
import add from "@/firebase/firestore/add";
import deleteDocument from "@/firebase/firestore/delete";
import constants from "@/config/constants";
import useDebounce from "@/hooks/useDebounce";
import SidebarItem from "./SidebarItem";

function Sidebar({ notes, selected, setNote, children }) {
  const addItem = async () => {
    await add(constants.collection, {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "Write your content here!",
          },
        },
      ],
      time: new Date().toISOString(),
      version: "2.28.0",
      name: `Document ${notes.length + 1}`,
    });
  };

  const editItem = async (name, data) => {
    const { id, ...rest } = data;
    await add(
      constants.collection,
      {
        ...rest,
        name: name,
      },
      id
    );
  };

  const deleteItem = async (id) => {
    await deleteDocument(constants.collection, id);
  };

  const handleEdit = (e) => {
    editItem(e.target.value, selected);
  };

  const debouncedEditItem = useDebounce(handleEdit, 1000);

  return (
    <div>
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden">
        <div className="flex items-center py-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            data-hs-overlay="#application-sidebar"
            aria-controls="application-sidebar"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg
              className="w-5 h-5"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <ol
            className="ml-3 flex items-center whitespace-nowrap min-w-0"
            aria-label="Breadcrumb"
          >
            <li className="flex items-center text-sm text-gray-800">
              DeepNote
              <svg
                className="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate "
              aria-current="page"
            >
              {selected?.name}
            </li>
          </ol>
        </div>
      </div>
      <div
        id="application-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0"
      >
        <div className="px-6">
          <a
            className="flex-none text-xl font-semibold"
            href="/"
            aria-label="DeepNote"
          >
            DeepNote
          </a>
        </div>

        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul className="w-full space-y-1.5">
            {notes.map((note, index) => (
              <SidebarItem
                key={index}
                note={note}
                selected={selected}
                deleteItem={deleteItem}
                debouncedEditItem={debouncedEditItem}
                setNote={setNote}
              />
            ))}
            <li>
              <button
                className="flex items-center w-full gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-md hover:bg-gray-100 "
                onClick={addItem}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Note
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}

export default Sidebar;
