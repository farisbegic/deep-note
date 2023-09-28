"use client";

import React from "react";
import deleteDocument from "@/firebase/firestore/deleteDocument";
import constants from "@/config/constants";
import useDebounce from "@/hooks/useDebounce";
import SidebarItem from "./SidebarItem";
import { signOut } from "next-auth/react";
import routes from "@/config/routes";
import addDocument from "@/firebase/firestore/addDocument";
import Image from "next/image";

function Sidebar({ notes, setNotes, selected, setNote, children, user }) {
  const addItem = async () => {
    try {
      // Set notes for optimistic UI
      setNotes({
        type: constants.operations.add,
        data: {
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
          name: `Document ${notes?.length + 1}`,
          user: {
            email: user.email,
          },
        },
      });

      // Add document to firestore
      await addDocument(constants.collections.notes, {
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
        name: `Document ${notes?.length + 1}`,
        user: {
          email: user.email,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const editItem = async (name, data) => {
    const { id, ...rest } = data;

    // Set notes for optimistic UI
    setNotes({
      type: constants.operations.edit,
      data: {
        id: id,
        name: name,
      },
    });

    // Update document in firestore
    await addDocument(
      constants.collections.notes,
      {
        ...rest,
        name: name,
      },
      id
    );
  };

  const deleteItem = async (id) => {
    // Set notes for optimistic UI
    setNotes({
      type: constants.operations.delete,
      data: id,
    });

    // Delete document from firestore
    await deleteDocument(constants.collections.notes, id);
  };

  const handleEdit = (e) => {
    editItem(e.target.value, selected);
  };

  const handleSearch = (e) => {
    notes?.filter((note) => {
      if (note?.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        setNote({
          ...note,
        });
      }
    });
  };

  const debouncedEditItem = useDebounce(handleEdit, 1000);
  const debouncedSearchItem = useDebounce(handleSearch, 1000);

  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[70] w-full bg-white border-b text-sm py-2.5 sm:py-4 ">
        <nav
          className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8"
          aria-label="Global"
        >
          <div className="mr-5 lg:mr-0 ">
            <a
              className="flex-none text-xl font-semibold"
              href={routes.home.path}
              aria-label="DeepNote"
            >
              DeepNote
            </a>
          </div>

          <div className="w-full flex items-center justify-end ml-auto gap-x-3 sm:order-3">
            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs"
              >
                <svg
                  className="w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
            </div>

            <div className="hidden sm:block">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="py-2 px-4 pl-11 block w-full border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search"
                  onChange={debouncedSearchItem}
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-end gap-2">
              <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                <button
                  id="hs-dropdown-with-header"
                  type="button"
                  className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs"
                >
                  <Image
                    src={user.image}
                    alt="User Image"
                    width={64}
                    height={64}
                    className="inline-block h-[2.375rem] w-[2.375rem] rounded-full ring-2 ring-white"
                    referrerPolicy="no-referrer"
                  />
                </button>

                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2"
                  aria-labelledby="hs-dropdown-with-header"
                >
                  <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>
                  <div className="mt-2 py-2 first:pt-0 last:pb-0">
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                      href="#"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Profile
                    </a>
                    <button
                      className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-white bg-red-600 hover:bg-red-400"
                      onClick={() => signOut()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
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
              className="text-sm font-semibold text-gray-800 truncate"
              aria-current="page"
            >
              {selected?.name}
            </li>
          </ol>
        </div>
      </div>

      <div className="flex h-[90vh]">
        <div
          id="application-sidebar"
          className="hs-overlay overflow-x-auto hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform lg:static md:static fixed hidden top-0 left-0 bottom-0 z-[60] w-72 bg-white border-r border-gray-200 pt-7 pb-10 lg:block lg:translate-x-0 lg:right-auto lg:bottom-0"
        >
          <div className="px-6 pb-6 lg:hidden">
            <a
              className="flex-none text-xl font-semibold"
              href={routes.home.path}
              aria-label="Deep Note"
            >
              DeepNote
            </a>
          </div>

          <nav
            className="hs-accordion-group px-6 w-full flex flex-grow flex-col"
            data-hs-accordion-always-open
          >
            <ul className="w-full space-y-1.5">
              <li>
                <button
                  className="flex items-center w-full gap-x-3.5 py-2 px-2.5 bg-blue-300 text-sm text-slate-700 rounded-md"
                  onClick={addItem}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
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
              {notes?.map((note, index) => (
                <SidebarItem
                  key={index}
                  note={note}
                  selected={selected}
                  deleteItem={deleteItem}
                  debouncedEditItem={debouncedEditItem}
                  setNote={setNote}
                />
              ))}
            </ul>
          </nav>
        </div>
        {children}
      </div>
    </>
  );
}

export default Sidebar;
