import React, {useContext, useEffect, useState} from "react";

import {prepareUrl} from './utils'
import {Filter, SelectedFacetsType, SortOption} from "./SyneriseProductGallery.types";

export interface SyneriseSearchStateProps {
    query?: string;
    page: number;
    limit: number;
    selectedFacets: SelectedFacetsType;
    correlationId?: string;
    sortKey?: string;
    indexId: string;
    trackerKey: string;
    apiHost: string;
    filters: Filter[],
    sort: SortOption[],
    itemsPerPage: number,
}

export interface SyneriseSearchContextType {
    state: SyneriseSearchStateProps;
    setLimit: (limit: number) => void
    setCorrelationId: (correlationId: string) => void
    setSortKey: (sortKey: string) => void
    setSelectedFacets: (selectedFacets: SelectedFacetsType) => void
}

const SyneriseSearchContext = React.createContext<SyneriseSearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: React.ReactNode,
    initialState: SyneriseSearchStateProps,
    onChange: (url: URL) => Promise<boolean>
}

export const SearchProvider = ({children, initialState, onChange}: SearchProviderProps) => {
    const [state, setState] = useState<SyneriseSearchStateProps>(initialState);
    
    const setLimit = (limit: number) => setState((prevState) => ({...prevState, limit: limit, page: 0}))
    const setSortKey = (sortKey: string) => {
        setState((prevState) => ({
            ...prevState, sortKey, page: 0,
            correlationId: undefined,
        }))
    }
    const setSelectedFacets = (selectedFacets: SelectedFacetsType) => setState((prevState) => ({
        ...prevState,
        selectedFacets,
        correlationId: undefined,
        page: 0
    }));
    const setCorrelationId = (correlationId: string) => setState((prevState) => ({
        ...prevState,
        correlationId
    }))

    useEffect(() => {
        onChange(prepareUrl(state))
    }, [state.page, state.limit, state.correlationId, state.query, state.selectedFacets, state.sort]);

    return (
        <SyneriseSearchContext.Provider
            value={{
                state,
                setLimit,
                setCorrelationId,
                setSortKey,
                setSelectedFacets
            }}
        >
            {children}
        </SyneriseSearchContext.Provider>
    )
}

export const useSearchContext = (): SyneriseSearchContextType => {
    const context = useContext(SyneriseSearchContext);
    if (!context) {
        throw new Error("useSearchContext must be used within a SearchProvider");
    }
    return context;
};
