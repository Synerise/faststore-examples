import {SelectField} from "@faststore/ui";
import {useSearchContext} from "@synerise/faststore-sdk";

type SortProps = {
    label?: string;
    options: {
        label: string,
        sortBy: string,
        ordering: "desc" | "asc"
    }[]
}

function ProductGallerySort({label = 'Sort by', options}: SortProps) {
    const {state, setSort} = useSearchContext();

    const selectOptions: Record<string, string> = options.reduce((acc, item) => {
        const key = `${item.sortBy},${item.ordering}`;
        acc[key] = item.label;
        return acc;
    }, {} as Record<string, string>);

    const value = state.sort?.sortBy ? `${state.sort.sortBy},${state.sort.ordering}` : undefined;

    return (
        <SelectField
            label={label}
            options={selectOptions}
            id="sort-select"
            className="sort / text__title-mini-alt"
            value={value}
            onChange={(e) => {
                const value = e.target.value;
                const [sortBy, ordering] = value.split(',');
                setSort(sortBy, ordering as 'asc' | 'desc')
            }}
        />
    )
}

export default ProductGallerySort;
