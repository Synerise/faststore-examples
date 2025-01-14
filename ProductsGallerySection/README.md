# Custom Section: Synerise Product Gallery

This guide explains how to create a custom section for showcasing AI-powered search queries using FastStore.
Example demonstrates how to implement simple search functionality with page prefetching, browser URL changes, filters, and custom facets.

The example was prepared using version `^3.5.0` of Faststore.

## Steps to Build the Custom Section

VTEX documentation: [Building and Customizing sections](https://developers.vtex.com/docs/guides/faststore/building-sections-creating-a-new-section) 

### 1. Define the Section in the Configuration File

Begin by defining the new section in the `cms/faststore/sections.json` file. This configuration specifies the section's settings, such as its name, type, and default configuration. The settings defined here determine what data and options can be passed to your section component from the Faststore panel.

#### Example: Define a "Synerise Product Gallery" Section

```json
[
  {
    "name": "SyneriseProductGallery",
    "requiredScopes": [],
    "schema": {
      "title": "Synerise Product Gallery",
      "description": "Product Gallery configuration - powered by Synerise",
      "type": "object",
      "required": ["indexId", "apiHost", "trackerKey"],
      "properties": {
        "indexId": {
          "title": "IndexID",
          "type": "string"
        },
        "apiHost": {
          "title": "Synerise api host",
          "type": "string",
          "enumNames": ["https://api.synerise.com", "https://api.geb.synerise.com"],
          "enum": ["https://api.synerise.com", "https://api.geb.synerise.com"],
          "default": "https://api.synerise.com"
        },
        "trackerKey": {
          "title": "Tracker Key",
          "type": "string"
        },
        "filters": {
          "title": "Filters",
          "type": "array",
          "items": {
            "title": "Filter",
            "type": "object",
            "required": ["facetName", "label"],
            "properties":{
              "label": {
                "title": "Label",
                "type": "string"
              },
              "facetName": {
                "title": "Facet name e.g (attributes.category)",
                "type": "string"
              },
              "facetType": {
                "title": "Type",
                "type": "string",
                "enumNames": ["Range", "Text"],
                "enum": ["Range", "Text"],
                "default": "Text"
              }
            }
          }
        },
        "sort": {
          "title": "Sort by options",
          "type": "array",
          "items": {
            "title": "Option",
            "type": "object",
            "properties": {
              "label": {
                "title": "Label",
                "type": "string"
              },
              "key": {
                "type": "string",
                "title": "Key e.g price_asc"
              },
              "sortBy": {
                "title": "Attribute name",
                "type": "string"
              },
              "ordering": {
                "title": "Ordering",
                "type": "string",
                "enumNames": ["asc", "desc"],
                "enum": ["asc", "desc"]
              },
              "isDefault": {
                "title": "Is default ?",
                "type": "boolean",
                "default": false
              }
            }
          }
        },
        "itemsPerPage": {
          "title": "Items per page",
          "type": "number",
          "default": 12
        }
      }
    }
  }
]
```

### 2. Create the React Component for the Section

Create a new React component to implement the section’s logic and visual structure. You can use the @faststore/ui library or custom components to build the section. Ensure the component can accept dynamic data from the configuration. You can use the files from this example.

### 3. Copy contents of graphql folder
Next, move the contents of the graphql folder to src/graphql in the main folder of the FastStore application.
