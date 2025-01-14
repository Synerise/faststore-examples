import {useMemo} from "react";
import {SyneriseSearchStateProps} from "../SearchProvider";
import {prepareUrl} from "../utils";

function usePagination(totalItems: number, pages: number[], state: SyneriseSearchStateProps) {
    const {itemsPerPage} = state

    const total = Math.ceil(totalItems / itemsPerPage)
    const next = Number(pages[pages.length - 1]) + 1
    const prev = pages[0] - 1

    return useMemo(
        () => ({
            next: next < total && {
                cursor: next,
                link: prepareUrl({...state, page: next}),
            },
            prev: prev > -1 && {
                cursor: prev,
                link: prepareUrl({...state, page: prev}),
            },
        }),
        [next, prev, state, total]
    )
}

export default usePagination;
