import { useState, useEffect } from "react";
import { SearchResponse, SyneriseSearchClient } from "@synerise/faststore-api";

const parseCookies = (): Record<string, string> => {
    const cookies = document.cookie;
    if (!cookies) return {};

    return cookies.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});
};

interface UseArticlesParams {
    trackerKey: string;
    apiHost: string;
    indexId: string;
    query: string;
}

function useArticles({ trackerKey, apiHost, indexId, query }: UseArticlesParams) {
    const [data, setData] = useState<SearchResponse | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const clientUUID = parseCookies()["_snrs_uuid"] || undefined;

    const fetchArticles = async () => {
        if (!indexId) return;

        setLoading(true);

        try {
            const searchClient = SyneriseSearchClient({
                indexId,
                host: apiHost,
                trackerKey,
            });

            const response = await searchClient.autocomplete({ query, clientUUID });
            setData(response);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [query, indexId]);

    return { data, error, loading };
}

export default useArticles;
