# Custom Section: Recommendation Shelf

This guide explains how to create a custom section for showcasing AI-powered recommendation campaigns on a store page using Faststore.

## Steps to Build the Custom Section

VTEX documentation: [Building and Customizing sections](https://developers.vtex.com/docs/guides/faststore/building-sections-creating-a-new-section) 

### 1. Define the Section in the Configuration File

Begin by defining the new section in the `cms/faststore/sections.json` file. This configuration specifies the section's settings, such as its name, type, and default configuration. The settings defined here determine what data and options can be passed to your section component from the Faststore panel.

#### Example: Define a "Recommendation Shelf" Section

```json
[
  {
    "name": "RecommendationShelf",
    "requiredScopes": [],
    "schema": {
      "title": "Recommendation shelf",
      "description": "Recommended items – powered by Synerise",
      "type": "object",
      "required": ["title", "campaignId", "itemsPerPage"],
      "properties": {
        "title": {
          "type": "string",
          "title": "Title"
        },
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "AI Recommendation Campaign ID"
        },
        "itemsPerPage": {
          "type": "integer",
          "title": "Number of items per page",
          "default": 5,
          "description": "Number of items to display per page in carousel"
        },
        "productCardConfiguration": {
          "title": "Product Card Configuration",
          "type": "object",
          "properties": {
            "showDiscountBadge": {
              "title": "Show discount badge?",
              "type": "boolean",
              "default": true
            },
            "bordered": {
              "title": "Cards should be bordered?",
              "type": "boolean",
              "default": true
            }
          }
        }
      }
    }
  }
]
```

### 2. Create the React Component for the Section

Create a new React component to implement the section’s logic and visual structure. You can use the @faststore/ui library or custom components to build the section. Ensure the component can accept dynamic data from the configuration.
