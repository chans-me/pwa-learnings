const VERSION = 1;

const cacheName = "dev-site-v5";
const assets = [
  "/index.html",
  "/css/app.css",
  "/js/app.js",
  "/images/placeholder.png"
];
removeOldCache = async () => {
  const keys = await caches.keys();
  return keys.map(async (cache) => {
    if(cache !== cacheName) {
      console.log('Service Worker: Removing old cache: '+cache);
      return await caches.delete(cache);
    }
  })
}
self.addEventListener('activate', event => {
// Remove old caches
console.log("activate event trigggered")
  event.waitUntil(
    removeOldCache()
  )
});

self.addEventListener("install", installEvent => {
  console.log("install cache event fired");
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
    //
  );
});

self.addEventListener("fetch", fetchEvent => {
  // if (self.request.url == 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3') {
    console.log(fetchEvent.request.url)
  // }
  // console.log(fetchEvent)
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var action = event.action;

  if (action === 'confirm') {
    notification.close();
  } else {
    event.waitUntil(
      clients.matchAll()
        .then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });

          if (client !== undefined) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
          notification.close();
        })
    );
  }
});

self.addEventListener('push', function(event) {
  var data = {title: 'New!', content: 'Something new happened!', openUrl: '/'};

  if (event.data) {
    data = Object.assign(data, JSON.parse(event.data.text()));
  }

  var options = {
    body: data.content,
    icon: '/images/icons/android-icon-192x192.png',
    badge: '/images/icons/android-icon-192x192.png',
    data: {
      url: data.openUrl
    },
    dir: 'ltr',
    lang: 'en-US',
    vibrate: [100, 50, 200],
    renotify: true,
    tag: 'renotify',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});