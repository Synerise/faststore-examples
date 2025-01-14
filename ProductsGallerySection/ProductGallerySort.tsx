import {SelectField} from "@faststore/ui";
import {useSearchContext} from "./SearchProvider";
import {getSorting} from "./utils";
import {SortOption} from "./SyneriseProductGallery.types";

type SortProps = {
    label?: string;
    options: SortOption[];
}

function ProductGallerySort({label = 'Sort by', options}: SortProps) {
    const {state, setSortKey} = useSearchContext();

    const selectOptions: Record<string, string> = options.reduce((acc, item) => {
        const key = item.key;
        acc[key] = item.label;
        return acc;
    }, {} as Record<string, string>);

    const sorting = state.sortKey ? getSorting(state.sortKey, state.sort) : undefined
    const value = sorting?.key;

    return (
        <SelectField
            label={label}
            options={selectOptions}
            id="sort-select"
            className="sort / text__title-mini-alt"
            value={value}
            onChange={(e) => setSortKey(e.target.value)}
        />
    )
}

export default ProductGallerySort;
