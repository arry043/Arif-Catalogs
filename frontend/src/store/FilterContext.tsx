import React, { createContext, useEffect, useReducer, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export interface FilterState {
    search: string;
    filters: {
        categories: string[];
        price_range: {
            min: number | null;
            max: number | null;
        };
        min_rating: number | null;
        in_stock: boolean;
        tags: string[];
    };
    sort: {
        by: string;
        order: "asc" | "desc";
    };
    pagination: {
        page: number;
        limit: number;
    };
    ui: {
        loading: boolean;
        error: string | null;
        total_items: number;
        total_pages: number;
        infinite_scroll: boolean;
    };
}

type FilterAction =
    | { type: "SET_SEARCH"; payload: string }
    | { type: "SET_CATEGORIES"; payload: string[] }
    | {
          type: "SET_PRICE_RANGE";
          payload: { min: number | null; max: number | null };
      }
    | { type: "SET_MIN_RATING"; payload: number | null }
    | { type: "TOGGLE_IN_STOCK" }
    | { type: "SET_TAGS"; payload: string[] }
    | { type: "SET_SORT"; payload: { by: string; order: "asc" | "desc" } }
    | { type: "SET_PAGE"; payload: number }
    | { type: "SET_LIMIT"; payload: number }
    | { type: "SET_UI"; payload: Partial<FilterState["ui"]> }
    | { type: "TOGGLE_INFINITE_SCROLL" }
    | { type: "CLEAR_FILTERS" }
    | { type: "RESET_PAGINATION" };

interface FilterContextValue {
    state: FilterState;
    dispatch: React.Dispatch<FilterAction>;
}

const initialState: FilterState = {
    search: "",
    filters: {
        categories: [],
        price_range: { min: null, max: null },
        min_rating: null,
        in_stock: false,
        tags: [],
    },
    sort: {
        by: "createdAt",
        order: "desc",
    },
    pagination: {
        page: 1,
        limit: 20,
    },
    ui: {
        loading: false,
        error: null,
        total_items: 0,
        total_pages: 0,
        infinite_scroll: false,
    },
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case "SET_SEARCH":
            return {
                ...state,
                search: action.payload,
                pagination: { ...state.pagination, page: 1 },
            };
        case "SET_CATEGORIES":
            return {
                ...state,
                filters: { ...state.filters, categories: action.payload },
                pagination: { ...state.pagination, page: 1 },
            };
        case "SET_PRICE_RANGE":
            return {
                ...state,
                filters: { ...state.filters, price_range: action.payload },
                pagination: { ...state.pagination, page: 1 },
            };
        case "SET_MIN_RATING":
            return {
                ...state,
                filters: { ...state.filters, min_rating: action.payload },
                pagination: { ...state.pagination, page: 1 },
            };
        case "TOGGLE_IN_STOCK":
            return {
                ...state,
                filters: {
                    ...state.filters,
                    in_stock: !state.filters.in_stock,
                },
                pagination: { ...state.pagination, page: 1 },
            };
        case "SET_TAGS":
            return {
                ...state,
                filters: { ...state.filters, tags: action.payload },
                pagination: { ...state.pagination, page: 1 },
            };
        case "SET_SORT":
            return { ...state, sort: action.payload };
        case "SET_PAGE":
            return {
                ...state,
                pagination: { ...state.pagination, page: action.payload },
            };
        case "SET_LIMIT":
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    limit: action.payload,
                    page: 1,
                },
            };
        case "SET_UI":
            return { ...state, ui: { ...state.ui, ...action.payload } };
        case "TOGGLE_INFINITE_SCROLL":
            return {
                ...state,
                ui: { ...state.ui, infinite_scroll: !state.ui.infinite_scroll },
                pagination: { ...state.pagination, page: 1 },
            };
        case "RESET_PAGINATION":
            return { ...state, pagination: { ...state.pagination, page: 1 } };
        case "CLEAR_FILTERS":
            return {
                ...initialState,
                ui: {
                    ...state.ui,
                    total_items: state.ui.total_items,
                    total_pages: state.ui.total_pages,
                },
            };
        default:
            return state;
    }
}

const FilterContext = createContext<FilterContextValue | null>(null);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(filterReducer, initialState);
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL on mount (run only once)
    const initializedRef = useRef(false);
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        const search = searchParams.get("search") || "";
        const categories = searchParams.getAll("category");
        const min_price = searchParams.get("min_price");
        const max_price = searchParams.get("max_price");
        const min_rating = searchParams.get("min_rating");
        const in_stock = searchParams.get("in_stock") === "true";
        const tags = searchParams.getAll("tags");
        const sort_by = searchParams.get("sort_by") || "createdAt";
        const sort_order =
            (searchParams.get("sort_order") as "asc" | "desc") || "desc";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (search) dispatch({ type: "SET_SEARCH", payload: search });
        if (categories.length)
            dispatch({ type: "SET_CATEGORIES", payload: categories });
        if (min_price || max_price)
            dispatch({
                type: "SET_PRICE_RANGE",
                payload: {
                    min: min_price ? Number(min_price) : null,
                    max: max_price ? Number(max_price) : null,
                },
            });
        if (min_rating)
            dispatch({ type: "SET_MIN_RATING", payload: Number(min_rating) });
        if (in_stock) dispatch({ type: "TOGGLE_IN_STOCK" });
        if (tags.length) dispatch({ type: "SET_TAGS", payload: tags });
        dispatch({
            type: "SET_SORT",
            payload: { by: sort_by, order: sort_order },
        });
        dispatch({ type: "SET_PAGE", payload: page });
        dispatch({ type: "SET_LIMIT", payload: limit });
    }, [searchParams]); // Only run on mount

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (state.search) params.set("search", state.search);
        state.filters.categories.forEach((c) => params.append("category", c));
        if (state.filters.price_range.min !== null)
            params.set("min_price", String(state.filters.price_range.min));
        if (state.filters.price_range.max !== null)
            params.set("max_price", String(state.filters.price_range.max));
        if (state.filters.min_rating !== null)
            params.set("min_rating", String(state.filters.min_rating));
        if (state.filters.in_stock) params.set("in_stock", "true");
        state.filters.tags.forEach((t) => params.append("tags", t));
        if (state.sort.by !== "createdAt") params.set("sort_by", state.sort.by);
        if (state.sort.order !== "desc")
            params.set("sort_order", state.sort.order);
        if (state.pagination.page !== 1)
            params.set("page", String(state.pagination.page));
        if (state.pagination.limit !== 20)
            params.set("limit", String(state.pagination.limit));

        const newQueryString = params.toString();
        const currentQueryString = searchParams.toString();

        if (newQueryString !== currentQueryString) {
            setSearchParams(params, { replace: true });
        }
    }, [state, setSearchParams, searchParams]);

    return (
        <FilterContext.Provider value={{ state, dispatch }}>
            {children}
        </FilterContext.Provider>
    );
};

export { FilterContext };
