import React, { useState, useRef } from "react";
import {
  Plus,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";

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

const DragDropButton = ({
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  onContextAction,
  page,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, page.id)}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className="p-2 rounded-md cursor-move hover:bg-gray-50"
      ></div>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="md"
            className={`h-10 w-10 p-0 ${
              isHovered ? "opacity-100" : "opacity-50"
            } transition-opacity`}
          >
            <MoreVertical className="h-6 w-6 text-black-400" />
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
  );
};

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
  isLast,
}) => {

  return (
    <React.Fragment key={page.id}>
      {index > 0 && (
        <div className="relative flex items-center">
          <div className="h-px w-8 bg-gray-300 mx-2 relative">
            <button
              onClick={() => onAddPage(index)}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

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
        <span
          className={`font-medium transition-colors ${
            activePage === page.id ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {page.name}
        </span>

        <DragDropButton
          onDragStart={onDragStart}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, index)}
          onDragEnd={onDragEnd}
          onContextAction={onContextAction}
          page={page}
        />
      </div>
      {isLast && (
        <div className="relative flex items-center">
          <div className="h-px w-10 bg-gray-300 mx-2 relative">
            <button
              onClick={() => onAddPage(pages.length)}
              className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 h-7 w-7 rounded-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

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

const PageContent = ({ pages, activePage, onClick }) => {
  const currentPage = pages.find((p) => p.id === activePage);
  const currentIndex = pages.findIndex((p) => p.id === activePage);
  const totalPages = pages.length;
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === totalPages - 1;

  const handlePrev = () => {
    if (isFirstPage) return;
    const prevIndex = currentIndex - 1;
    onClick(pages[prevIndex].id);
  };

  const handleNext = () => {
    if (isLastPage) return;
    const nextIndex = currentIndex + 1;
    onClick(pages[nextIndex].id);
  };

  const renderFormFields = () => {
    if (!currentPage) return null;
    return (
      <>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentPage.name} Content
        </h3>
        <FormField label="Default Field" placeholder="Enter information" />
      </>
    );
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {currentPage?.name || "Page"} Content
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Page {currentIndex + 1} of {totalPages}
        </p>
      </div>

      <div className="py-4">{renderFormFields()}</div>

      <div className="flex justify-between items-center mt-8">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={isFirstPage}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

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
    </div>
  );
};

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
      if (pageId === activePage && newPages.length > 0) {
        setActivePage(newPages[0].id);
      } else if (newPages.length === 0) {
        const defaultPage = { id: "1", name: "Default" };
        setPages([defaultPage]);
        setActivePage(defaultPage.id);
      }
      return;
    }
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
              Drag to reorder pages, click plus to add new ones
            </p>
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

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-center">
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
              isLast={index === pages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
