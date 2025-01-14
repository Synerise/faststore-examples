import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Link, LinkProps, LinkElementType} from '@faststore/ui'

export interface SearchProductItemProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * ID to find this component in testing tools (e.g.: cypress,
     * testing-library, and jest).
     */
    testId?: string
    /**
     * Props for the link from SearchProduct component.
     */
    linkProps?: Partial<LinkProps<LinkElementType>>
}

const SearchArticleItem = forwardRef<HTMLLIElement, SearchProductItemProps>(
    function ProductItem(
        { testId = 'fs-search-article-item', linkProps, children },
        ref
    ) {
        return (
            <li ref={ref} data-fs-search-article-item data-testid={testId}>
                <Link {...linkProps} data-fs-search-article-item-link variant="display">
                    {children}
                </Link>
            </li>
        )
    }
)

export default SearchArticleItem
