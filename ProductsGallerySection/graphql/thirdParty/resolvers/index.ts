import { Resolvers as SyneriseResolvers } from "@synerise/faststore-api";


const resolvers = {
    SyneriseSearchResult: SyneriseResolvers.SyneriseSearchResult,
    Query: {
        syneriseAISearch: SyneriseResolvers.Query.syneriseAISearch
    }
};

export default resolvers;
