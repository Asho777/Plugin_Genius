import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Plugin } from '../pages/TemplatesPage'

interface SearchState {
  plugins: Plugin[]
  searchTerm: string
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}

interface SearchContextType {
  searchState: SearchState
  setSearchResults: (plugins: Plugin[], searchTerm: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const initialState: SearchState = {
  plugins: [],
  searchTerm: '',
  isLoading: false,
  error: null,
  hasSearched: false
}

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchState, setSearchState] = useState<SearchState>(initialState)

  const setSearchResults = (plugins: Plugin[], searchTerm: string) => {
    setSearchState(prev => ({
      ...prev,
      plugins,
      searchTerm,
      hasSearched: true,
      error: null
    }))
  }

  const setLoading = (loading: boolean) => {
    setSearchState(prev => ({
      ...prev,
      isLoading: loading
    }))
  }

  const setError = (error: string | null) => {
    setSearchState(prev => ({
      ...prev,
      error,
      isLoading: false
    }))
  }

  const clearSearch = () => {
    setSearchState(initialState)
  }

  return (
    <SearchContext.Provider value={{
      searchState,
      setSearchResults,
      setLoading,
      setError,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
