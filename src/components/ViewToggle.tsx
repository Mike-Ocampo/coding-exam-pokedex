import React from "react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div className="text-center">
      <button
        onClick={() => handleViewChange("grid")}
        className={`px-4 py-2 mr-4 border rounded-lg ${
          viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Grid View
      </button>
      <button
        onClick={() => handleViewChange("list")}
        className={`px-4 py-2 border rounded-lg ${
          viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        List View
      </button>
    </div>
  );
};

export default ViewToggle;
