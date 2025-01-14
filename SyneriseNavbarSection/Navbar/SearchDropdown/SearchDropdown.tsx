import {
    SearchProducts as UISearchProducts,
    SearchAutoComplete as UISearchAutoComplete,
    SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
    SearchDropdown as UISearchDropdown,
    useSearch,
} from '@faststore/ui'

import { ProductSummary_ProductFragment } from '@generated/graphql'
import SearchProductItem from 'src/components/search/SearchProductItem'

import type {
    IntelligentSearchAutocompleteClickEvent,
    IntelligentSearchAutocompleteClickParams,
} from 'src/sdk/analytics/types'

import {SearchHistory} from "src/components/search/SearchHistory";
import {formatSearchPath} from "src/sdk/search/formatSearchPath";

import {SearchArticles as UISearchArticles} from './ui'

import SearchArticleItem from './SearchArticleItem'

interface SearchDropdownProps {
    [key: string]: any,
    articles: {
        [key: string]: any;
        _promotedByRules: number[];
        itemId: number;
    }[]
}

export function sendAutocompleteClickEvent({
   url,
   term,
   position,
   productId,
}: IntelligentSearchAutocompleteClickParams) {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        sendAnalyticsEvent<IntelligentSearchAutocompleteClickEvent>({
            name: 'intelligent_search_autocomplete_click',
            params: { term, url, productId, position },
        })
    })
}

function SearchDropdown({ articles, ...otherProps }: SearchDropdownProps) {
    //@ts-ignore
    const { values: {term, terms, products, onSearchSelection, isLoading} } = useSearch()

    return (
        <UISearchDropdown {...otherProps}>
            <SearchHistory />
            <UISearchAutoComplete>
                {!isLoading && terms?.map(({ value: suggestion }: {value: string}) => (
                    <UISearchAutoCompleteTerm
                        key={suggestion}
                        term={term}
                        suggestion={suggestion}
                        linkProps={{
                            href: formatSearchPath({
                                term: suggestion
                            }),
                            onClick: () => {
                                onSearchSelection?.(
                                    suggestion,
                                    formatSearchPath({ term: suggestion })
                                )
                                sendAutocompleteClickEvent({
                                    term: suggestion,
                                    url: window.location.href,
                                })
                            },
                        }}
                    />
                ))}
            </UISearchAutoComplete>
            <UISearchProducts>
                {products.map((product: any, index: number) => {
                    const productParsed = product as ProductSummary_ProductFragment
                    return (
                        <SearchProductItem
                            key={productParsed.id}
                            product={productParsed}
                            index={index}
                        />
                    )
                })}
            </UISearchProducts>

            {!isLoading && articles?.length > 0 && (
                <UISearchArticles>
                    {articles.map((article: any, index: number) => (
                        <SearchArticleItem key={article.itemId} article={article} index={index} />
                    ))}
                </UISearchArticles>
            )}
        </UISearchDropdown>
    )
}

export default SearchDropdown
