import React from "react";
import ReactDOM from "react-dom/client";
import MarktionEditor from "./src/marktion.js";

function Header() {
  return (
    <header className="w-full p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="container flex justify-between h-16 mx-auto">
        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          Marktion
        </a>

        <div className="items-center flex-shrink-0 lg:flex">
          <label
            htmlFor="theme-switch"
            className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100"
          >
            <span>Left</span>
            <span className="relative">
              <input
                id="theme-switch"
                type="checkbox"
                className="hidden peer"
              />
              <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-400 peer-checked:dark:bg-violet-400"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-800"></div>
            </span>
            <span>Right</span>
          </label>
        </div>
      </div>
    </header>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <>
      <Header />
      <MarktionEditor />
    </>
  </React.StrictMode>
);
