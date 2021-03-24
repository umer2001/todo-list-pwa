/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { BroadcastUpdatePlugin } from "workbox-broadcast-update";
import { Queue } from "workbox-background-sync";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    url.pathname.startsWith("/.netlify/functions/"),
  new NetworkFirst({
    cacheName: "todos",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BroadcastUpdatePlugin(),
    ],
  })
);

// for creade update and delete

const queue = new Queue("myQueueName");

self.addEventListener("fetch", (event) => {
  const reqUrl = new URL(event.request.url);
  if (
    reqUrl.origin === self.location.origin &&
    reqUrl.pathname.startsWith("/.netlify/functions/") &&
    (event.request.method === "POST" ||
      event.request.method === "PUT" ||
      event.request.method === "DELETE")
  ) {
    const promiseChain = fetch(event.request.clone()).catch((err) => {
      return queue.pushRequest({ request: event.request });
    });

    event.waitUntil(promiseChain);
  }
});

// periodic sync

if ("serviceWorker" in navigator) {
  const registration = await navigator.serviceWorker.ready;
  // Check if periodicSync is supported
  if ("periodicSync" in registration) {
    // Request permission
    const status = await navigator.permissions.query({
      name: "periodic-background-sync",
    });
    if (status.state === "granted") {
      try {
        // Register new sync every 24 hours
        await registration.periodicSync.register("news", {
          minInterval: 60 * 1000, // 1 sec
        });
        console.log("Periodic background sync registered!");
      } catch (e) {
        console.error(`Periodic background sync failed:\n${e}`);
      }
    }
  }
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "news") {
    console.log("Fetching news in the background!");
    event.waitUntil(
      (async () => {
        const todosCache = await caches.open("todos");
        await todosCache.add("/.netlify/functions/getTodos");
        console.log(`In periodicsync handler, updated`);
      })()
    );
  }
});
