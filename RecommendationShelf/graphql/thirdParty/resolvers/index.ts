import { Resolvers as SyneriseResolvers } from "@synerise/faststore-api";

const resolvers = {
  SyneriseRecommendationsResult:
    SyneriseResolvers.SyneriseRecommendationsResult,
  Query: {
    syneriseAIRecommendations:
      SyneriseResolvers.Query.syneriseAIRecommendations,
  },
};

export default resolvers;
