// contexts/FilterContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  application: string;
  fuelType: string;
  payload: string;
  priceRange: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isFiltered: boolean;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  application: "All",
  fuelType: "All",
  payload: "All",
  priceRange: "All",
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);

  const setFilters = (newFilters: FilterState) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState(defaultFilters);
  };

  const isFiltered = Object.values(filters).some((value) => value !== "All");

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, isFiltered, clearFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
