import React, {HTMLAttributes} from "react";
import { List } from '@faststore/ui'

export interface SearchArticlesProps extends HTMLAttributes<HTMLDivElement> {
    testId?: string
    title?: string
}

function SearchArticles({
    testId = "fs-search-articles",
    title = 'Suggested Articles',
    children,
    ...otherProps
}: SearchArticlesProps) {
    return (
        <section data-testid={testId} data-fs-search-articles {...otherProps}>
            <header data-fs-search-articles-header>
                <p data-fs-search-articles-title>{title}</p>
            </header>
            <List as="ol">{children}</List>
        </section>
    )
}

export default SearchArticles
