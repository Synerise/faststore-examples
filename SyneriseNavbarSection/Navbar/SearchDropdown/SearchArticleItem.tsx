import {
    SearchArticleItem as UISearchArticleItem,
    SearchArticleItemContent as UISearchArticleItemContent,
    SearchArticleItemImage as UISearchArticleItemImage
} from './ui'

type SearchArticleItemProps = {
    /**
     * Article to be showed in `SearchArticleItem`.
     */
    article: {
        itemId: string
        title: string
        image: string
        thumbnail: string
    }
    /**
     * Index to generate product link.
     */
    index: number
}

function SearchArticleItem({
   article,
   index,
   ...otherProps
}: SearchArticleItemProps) {
    const {
        itemId,
        title,
        image,
        thumbnail
    } = article


    return (
        <UISearchArticleItem
            // linkProps={}
            {...otherProps}
        >
            <UISearchArticleItemImage>
                <img src={thumbnail} alt={title} width={56} height={56} />
            </UISearchArticleItemImage>
            <UISearchArticleItemContent title={title} />
        </UISearchArticleItem>
    )
}

export default SearchArticleItem
