/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as contributors from "../contributors.js";
import type * as guestbook from "../guestbook.js";
import type * as images from "../images.js";
import type * as parts from "../parts.js";
import type * as settings from "../settings.js";
import type * as suppliers from "../suppliers.js";
import type * as tasks from "../tasks.js";
import type * as updates from "../updates.js";
import type * as users from "../users.js";
import type * as worklog from "../worklog.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  contributors: typeof contributors;
  guestbook: typeof guestbook;
  images: typeof images;
  parts: typeof parts;
  settings: typeof settings;
  suppliers: typeof suppliers;
  tasks: typeof tasks;
  updates: typeof updates;
  users: typeof users;
  worklog: typeof worklog;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
