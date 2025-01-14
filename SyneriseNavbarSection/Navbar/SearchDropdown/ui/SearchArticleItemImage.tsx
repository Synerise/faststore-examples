import type {HTMLAttributes} from 'react'
import React, {forwardRef} from 'react'

export interface SearchArticleItemImageProps
    extends HTMLAttributes<HTMLDivElement> {
    /**
     * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
     */
    testId?: string
}

const SearchArticleItemImage = forwardRef<
    HTMLDivElement,
    SearchArticleItemImageProps
>(function SearchArticleItemImage(
    {testId = 'fs-search-article-item-image', children, ...otherProps},
    ref
) {
    return (
        <div
            ref={ref}
            data-fs-search-article-item-image
            data-testid={testId}
            {...otherProps}
        >
            {children}
        </div>
    )
})

export default SearchArticleItemImage
