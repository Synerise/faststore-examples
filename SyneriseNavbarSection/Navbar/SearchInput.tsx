import {CSSProperties, SetStateAction, useEffect} from 'react'
import {
    Suspense,
    forwardRef,
    lazy,
    useDeferredValue,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import type { SearchEvent, SearchState } from '@faststore/sdk'

import {
    Icon as UIIcon,
    IconButton as UIIconButton,
    SearchInput as UISearchInput,
} from '@faststore/ui'

import type {
    SearchInputFieldProps as UISearchInputFieldProps,
    SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import { SearchProviderContextValue } from '@faststore/ui'

import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useOnClickOutside from 'src/sdk/ui/useOnClickOutside'

import { formatSearchPath } from 'src/sdk/search/formatSearchPath'

import {useAutocomplete, useSuggestions, useArticles} from '../hooks'
import {NavbarProps} from "../SyneriseNavbarSection";

const SearchDropdown = lazy(
    /* webpackChunkName: "SearchDropdown" */
    () => import('./SearchDropdown/SearchDropdown')
)

const UISearchInputField = dynamic<UISearchInputFieldProps & any>(() =>
    /* webpackChunkName: "UISearchInputField" */
    import('@faststore/ui').then((module) => module.SearchInputField)
)

const MAX_SUGGESTIONS = 5

export type SearchInputProps = {
    onSearchClick?: () => void
    buttonTestId?: string
    containerStyle?: CSSProperties
    sort?: string
    searchInput: NavbarProps['searchInput']
} & Omit<UISearchInputFieldProps, 'onSubmit'>

export type SearchInputRef = UISearchInputFieldRef & {
    resetSearchInput: () => void
}

const sendAnalytics = async (term: string) => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        sendAnalyticsEvent<SearchEvent>({
            name: 'search',
            params: { search_term: term },
        })
    })
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
    function SearchInput(
        {
            onSearchClick,
            buttonTestId = 'fs-search-button',
            containerStyle,
            sort,
            searchInput,
            ...otherProps
        },
        ref
    ) {
        const { hidden } = otherProps
        const { apiHost, trackerKey, placeholder, suggestionsIndex, productsIndex, articlesIndex } = searchInput;
        const [searchQuery, setSearchQuery] = useState<string>('')
        const searchQueryDeferred = useDeferredValue(searchQuery)
        const [searchDropdownVisible, setSearchDropdownVisible] =
            useState<boolean>(false)

        const searchRef = useRef<HTMLDivElement>(null)
        const { addToSearchHistory } = useSearchHistory()
        const router = useRouter()

        useImperativeHandle(ref, () => ({
            resetSearchInput: () => setSearchQuery(''),
        }))

        const onSearchSelection: SearchProviderContextValue['onSearchSelection'] = (
            term,
            path
        ) => {
            addToSearchHistory({ term, path })
            sendAnalytics(term)
            setSearchDropdownVisible(false)
            setSearchQuery(term)
        }

        useOnClickOutside(searchRef, () => setSearchDropdownVisible(false))

        //GRAPHQL QUERY
        const { data, error } = useAutocomplete({trackerKey, apiHost, indexId: productsIndex, query: searchQuery})
        //DIRECT REST API REQUESTS
        const { data: suggestionsData, error: suggestionsError, loading: suggestionsLoading} = useSuggestions({trackerKey, apiHost, indexId: suggestionsIndex, query: searchQuery})
        const { data: articlesData, error: articlesError, loading: articlesLoading} = useArticles({trackerKey, apiHost, indexId: articlesIndex, query: searchQuery})

        const products = (data?.syneriseAISearch.autocomplete?.data ?? []).slice(0, MAX_SUGGESTIONS)
        const terms = (suggestionsData?.data ?? []).slice(0, 5).map(item => ({value: item.suggestion}));
        const articles = (articlesData?.data ?? []).slice(0, 3) as [];

        const isLoading = !error && !data

        const buttonProps = {
            onClick: onSearchClick,
            testId: buttonTestId,
        }

        return (
            <>
                {hidden ? (
                    <UIIconButton
                        type="submit"
                        aria-label="Submit Search"
                        icon={<UIIcon name="MagnifyingGlass" />}
                        size="small"
                        {...buttonProps}
                    />
                ) : (
                    <UISearchInput
                        ref={searchRef}
                        visibleDropdown={searchDropdownVisible}
                        onSearchSelection={onSearchSelection}
                        term={searchQueryDeferred}
                        terms={terms}
                        products={products}
                        isLoading={isLoading}
                    >
                        <UISearchInputField
                            ref={ref}
                            buttonProps={buttonProps}
                            placeholder={placeholder}
                            onChange={(e: { target: { value: SetStateAction<string> } }) =>
                                setSearchQuery(e.target.value)
                            }
                            onSubmit={(term: string) => {
                                const path = formatSearchPath({
                                    term,
                                    sort: sort as SearchState['sort'],
                                })

                                onSearchSelection(term, path)
                                router.push(path)
                            }}
                            onFocus={() => setSearchDropdownVisible(true)}
                            value={searchQuery}
                            {...otherProps}
                        />

                        {searchDropdownVisible && (
                            <Suspense fallback={null}>
                                <SearchDropdown articles={articles} />
                            </Suspense>
                        )}
                    </UISearchInput>
                )}
            </>
        )
    }
)

export default SearchInput
