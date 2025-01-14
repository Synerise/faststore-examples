import React, { forwardRef } from 'react'

export interface SearchArticleItemContentProps {
    /**
     * Specifies the article's title.
     */
    title: string
}

const SearchArticleItemContent = forwardRef<
    HTMLElement,
    SearchArticleItemContentProps
>(function SearchArticleItemContent({ title, ...otherProps }, ref) {
    return (
        <section ref={ref} data-fs-search-article-item-content {...otherProps}>
            <p data-fs-search-article-item-title>{title}</p>
        </section>
    )
})

export default SearchArticleItemContent
