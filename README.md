# Synerise Solutions in VTEX FastStore

This repository provides examples of implementing **Synerise solutions** in the **VTEX FastStore** application. These examples demonstrate the integration of Synerise's advanced search and recommendation features using the FastStore platform.

## Libraries Used

This project utilizes the following libraries to achieve seamless integration with Synerise's API and state management:

### [`@synerise/faststore-api`](https://www.npmjs.com/package/@synerise/faststore-api)
Provides:
- Clients for **search** and **recommendation** functionalities.
- Pre-configured **resolvers** to simplify integration and enhance developer productivity.

### [`@synerise/faststore-sdk`](https://www.npmjs.com/package/@synerise/faststore-sdk)
Used for:
- **State management** within the FastStore application.
- Includes utility functions and hooks for interacting with the API, such as:
    - `useSearchQuery`
    - `useSearchListing`
    - `useSearchAutocomplete`
- **Important:** These hooks depend on the pre-configured resolvers provided by `@synerise/faststore-api`.

## How to Use the Libraries

The examples in this repository illustrate how to:
1. Set up and configure the required Synerise libraries in a FastStore application.
2. Implement hooks and resolvers for:
    - Efficient API interactions.
    - Enhancing search and recommendation performance.
3. Customize the integration to suit your specific requirements.
