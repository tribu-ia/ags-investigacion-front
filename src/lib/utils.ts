import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (
  dateString: string,
  locale: string = 'es-ES',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
) => {
  const date = new Date(dateString);
  return date.toLocaleString(locale, options);
}

export type FilterableResource = {
  id: string;
  title: string;
  description: string;
  type: string;
  topic: string;
  tags: string[];
}

export type FilterConfig<T> = {
  searchFields: (keyof T)[];
  filters: {
    field: keyof T;
    value: string;
    defaultValue?: string;
  }[];
}

export function createFilter<T extends FilterableResource>(config: FilterConfig<T>) {
  return function filter(
    items: T[],
    searchTerm: string,
    selectedFilters: Record<string, string>
  ): T[] {
    return items.filter((item) => {
      // Handle search across configured fields
      const matchesSearch = searchTerm === '' || config.searchFields.some(field => {
        const value = item[field];
        return Array.isArray(value)
          ? value.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
          : String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Handle filters
      const matchesFilters = config.filters.every(({ field, defaultValue }) => {
        const filterValue = selectedFilters[field as string];
        return filterValue === defaultValue || item[field] === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  };
}