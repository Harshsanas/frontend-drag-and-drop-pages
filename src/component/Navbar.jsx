import React from "react";
import { FiGithub } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50 border-b border-indigo-100">
      <div className="flex items-center space-x-3 group">
        {/* Animated drag-drop logo */}
        <div className="relative w-10 h-10">
          {/* Document being dragged */}
          <div className="absolute z-10 w-7 h-7 bg-white border-2 border-indigo-400 rounded-lg shadow-md group-hover:animate-bounce group-hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 p-0.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-indigo-300 rounded-sm"
                ></div>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <path
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Hand cursor */}
          <div className="absolute -left-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0"
                strokeLinecap="round"
              />
              <path
                d="M14 10V6a2 2 0 00-2-2v0a2 2 0 00-2 2v4"
                strokeLinecap="round"
              />
              <path
                d="M10 10V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8a6 6 0 006 6h2a6 6 0 006-6v-4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Drag-Drop-App
        </h1>
      </div>

      <a
        href="https://github.com/Harshsanas/frontend-drag-and-drop-pages"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-indigo-700 transition-colors hover:scale-110 transform"
      >
        <FiGithub className="w-6 h-6" />
      </a>
    </nav>
  );
}