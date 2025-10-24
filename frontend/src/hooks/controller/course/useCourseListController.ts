import { useState } from "react";

export function useCourseListController() {
  const [searchQuery, setSearchQuery] = useState("");

  return {
    searchQuery,
    setSearchQuery,
  };
}
