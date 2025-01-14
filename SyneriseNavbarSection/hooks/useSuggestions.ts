import { useState, useEffect } from "react";
import {
    SearchResponse,
    SyneriseSearchClient,
} from "@synerise/faststore-api";

const parseCookies = (): Record<string, string> => {
    return document.cookie
        .split("; ")
        .reduce((acc: Record<string, string>, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
};

function useSuggestions({trackerKey, apiHost, indexId, query}: {trackerKey: string, apiHost: string, indexId: string, query: string}) {
    const [data, setData] = useState<SearchResponse>();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const clientUUID = parseCookies()["_snrs_uuid"] || undefined;

    useEffect(() => {
        if (!indexId) {
            setLoading(false);
            return;
        }

        const searchClient = SyneriseSearchClient({
            indexId,
            host: apiHost,
            trackerKey,
        });

        searchClient
            .autocomplete({ query, clientUUID })
            .then((response) => {
                setData(response);
                setError(null);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query, indexId]);

    return { data, error, loading };
};

export default useSuggestions;
