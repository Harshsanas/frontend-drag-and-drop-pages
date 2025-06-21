import React, { useState, useRef } from "react";
import {
  Plus,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Button Component
const Button = ({
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
  };
  const variantClasses = {
    default: "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400",
    ghost: "hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-400",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Dropdown Components
const DropdownMenu = ({ children, open, onOpenChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { open, onOpenChange });
        }
        if (child.type === DropdownMenuContent && open) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, open, onOpenChange }) => {
  return React.cloneElement(children, {
    className: `${children.props.className || ""} cursor-pointer`,
    onClick: (e) => {
      e.stopPropagation();
      onOpenChange(!open);
    },
  });
};

const DropdownMenuContent = ({ align = "start", className = "", children }) => {
  const alignmentClasses = {
    start: "left-0",
    end: "right-0",
  };
  return (
    <div
      className={`absolute z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// PageTab Component
const PageTab = ({
  page,
  index,
  pages,
  activePage,
  draggedItem,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  onClick,
  onContextAction,
  onAddPage,
  hoveredIndex,
  setHoveredIndex,
  isLast,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handlePrevTab = (e) => {
    e.stopPropagation();
    const prevIndex = index > 0 ? index - 1 : pages.length - 1;
    onClick(pages[prevIndex].id);
  };

  const handleNextTab = (e) => {
    e.stopPropagation();
    const nextIndex = index < pages.length - 1 ? index + 1 : 0;
    onClick(pages[nextIndex].id);
  };

  const isFirstTab = index === 0;
  const isLastTab = index === pages.length - 1;

  return (
    <React.Fragment key={page.id}>
      {/* Add button that appears on hover */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
            hoveredIndex === index
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"
          }`}
          onClick={() => onAddPage(index)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Page card */}
      <div
        draggable
        onDragStart={(e) => onDragStart(e, page.id)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
        onClick={() => onClick(page.id)}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer
          transition-all duration-200 hover:shadow-md group
          ${
            activePage === page.id
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          }
          ${draggedItem === page.id ? "opacity-50 scale-95" : ""}
          ${
            dragOverIndex === index && draggedItem !== page.id
              ? "border-blue-300 bg-blue-25"
              : ""
          }
        `}
      >
        <ChevronLeft
          className={`h-4 w-4 ${
            isFirstTab
              ? "text-gray-300 cursor-default"
              : "text-gray-400 hover:text-gray-600 cursor-pointer"
          }`}
          onClick={isFirstTab ? undefined : handlePrevTab}
        />

        <span
          className={`font-medium transition-colors ${
            activePage === page.id ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {page.name}
        </span>

        <ChevronRight
          className={`h-4 w-4 ${
            isLastTab
              ? "text-gray-300 cursor-default"
              : "text-gray-400 hover:text-gray-600 cursor-pointer"
          }`}
          onClick={isLastTab ? undefined : handleNextTab}
        />

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onContextAction("rename", page.id);
                setDropdownOpen(false);
              }}
              className="cursor-pointer"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onContextAction("duplicate", page.id);
                setDropdownOpen(false);
              }}
              className="cursor-pointer"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onContextAction("delete", page.id);
                setDropdownOpen(false);
              }}
              className="cursor-pointer text-red-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Final add button if last item */}
      {isLast && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredIndex(pages.length)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
              hoveredIndex === pages.length
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
            onClick={() => onAddPage(pages.length)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

// FormField Component
const FormField = ({ label, type = "text", placeholder = "" }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

// PageContent Component
const PageContent = ({ pages, activePage, onClick }) => {
  const currentPage = pages.find((p) => p.id === activePage);
  const currentIndex = pages.findIndex((p) => p.id === activePage);
  const totalPages = pages.length;
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === totalPages - 1;

  const handlePrev = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalPages - 1;
    onClick(pages[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < totalPages - 1 ? currentIndex + 1 : 0;
    onClick(pages[nextIndex].id);
  };

  const renderFormFields = () => {
    switch (currentPage?.name) {
      case "Info":
        return (
          <>
            <FormField label="Full Name" placeholder="Enter your full name" />
            <FormField
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
          </>
        );
      case "Details":
        return (
          <>
            <FormField label="Address" placeholder="Enter your address" />
            <FormField
              label="Phone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </>
        );
      case "Other":
        return (
          <>
            <FormField
              label="About You"
              type="textarea"
              placeholder="Tell us about yourself"
            />
          </>
        );
      case "Ending":
        return (
          <>
            <FormField
              label="Final Comments"
              type="textarea"
              placeholder="Any final comments?"
            />
          </>
        );
      default:
        return (
          <FormField label="Default Field" placeholder="Enter information" />
        );
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={isFirstPage}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {currentPage?.name || "Page"} Content
          </h2>
          <p className="text-gray-500 text-sm">
            Page {currentIndex + 1} of {totalPages}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={isLastPage}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="py-4">{renderFormFields()}</div>
    </div>
  );
};

// Main Component
export default function Home() {
  const [pages, setPages] = useState([
    { id: "1", name: "Info" },
    { id: "2", name: "Details" },
    { id: "3", name: "Other" },
    { id: "4", name: "Ending" },
  ]);
  const [activePage, setActivePage] = useState("1");
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dragCounter = useRef(0);

  const handleDragStart = (e, pageId) => {
    setDraggedItem(pageId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", pageId);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (!draggedItem) return;

    const draggedIndex = pages.findIndex((page) => page.id === draggedItem);
    if (draggedIndex === -1) return;

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(dropIndex, 0, draggedPage);

    setPages(newPages);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const addPage = (index) => {
    const newPage = {
      id: Date.now().toString(),
      name: `Page ${pages.length + 1}`,
    };
    const newPages = [...pages];
    newPages.splice(index, 0, newPage);
    setPages(newPages);
    setActivePage(newPage.id);
  };

  const handleContextAction = (action, pageId) => {
    if (action === "delete") {
      const newPages = pages.filter((page) => page.id !== pageId);
      setPages(newPages);

      // If we deleted the active page, set the first page as active
      if (pageId === activePage && newPages.length > 0) {
        setActivePage(newPages[0].id);
      } else if (newPages.length === 0) {
        // If no pages left, create a default one
        const defaultPage = { id: "1", name: "Default" };
        setPages([defaultPage]);
        setActivePage(defaultPage.id);
      }
      return;
    }

    console.log(`${action} page:`, pageId);
    // Implement other actions (rename, duplicate) here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Form Builder
            </h1>
            <p className="text-gray-600">
              Drag to reorder pages, hover to add new ones
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap gap-2 items-center">
            {pages.map((page, index) => (
              <PageTab
                key={page.id}
                page={page}
                index={index}
                pages={pages}
                activePage={activePage}
                draggedItem={draggedItem}
                dragOverIndex={dragOverIndex}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onClick={setActivePage}
                onContextAction={handleContextAction}
                onAddPage={addPage}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                isLast={index === pages.length - 1}
              />
            ))}
          </div>
        </div>

        {pages.length > 0 ? (
          <PageContent
            pages={pages}
            activePage={activePage}
            onClick={setActivePage}
          />
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              No pages available. Add a new page to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
