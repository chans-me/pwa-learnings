(function() {
  window.addEventListener('click', function() {
    console.log("click event triggered")
    // var audio = new Audio("http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3");
    var audio = document.getElementById('hintSound')
    audio.play()

    setTimeout(() => {
      audio.pause();
    }, 2000);  
  })
  setTimeout(() => {
    document.getElementById("title").click();  
  }, 3000)
  
  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors.
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  window.addEventListener('load', function() {
      if ('serviceWorker' in navigator &&
          (window.location.protocol === 'https:' || isLocalhost)) {
        navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
          console.log('service-worker registered');
          // updatefound is fired if service-worker.js changes.
          registration.onupdatefound = function() {
            console.log('service-worker update found');
            // updatefound is also fired the very first time the SW is installed,
            // and there's no need to prompt for a reload at that point.
            // So check here to see if the page is already controlled,
            // i.e. whether there's an existing service worker.
            if (navigator.serviceWorker.controller) {
              // The updatefound event implies that registration.installing is set
              var installingWorker = registration.installing;

              installingWorker.onstatechange = function() {
                switch (installingWorker.state) {
                  case 'installed':
                    console.log('service-worker on state change installed');
                    // At this point, the old content will have been purged and the
                    // fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in the page's interface.
                    break;

                  case 'redundant':
                    throw new Error('The installing ' +
                                    'service worker became redundant.');

                  default:
                    // Ignore
                }
              };
            }
          };
        }).catch(function(e) {
          console.error('Error during service worker registration:', e);
        });
      }
  });
})();


console.log('Initially ' + (window.navigator.onLine ? 'on' : 'off') + 'line');

window.addEventListener('online', () => console.log('Became online'));
window.addEventListener('offline', () => console.log('Became offline'));

let installPrompt = null;
let installFlag = true;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  console.log("Install prompt event preserved")
  installPrompt = event;
  return false;
});

// let installBtn = document.getElementById("installBtn");

document.getElementById("installBtn").addEventListener("click", function(){
  console.log('install button click event triggered')
  if (installPrompt && installFlag) {
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'dismissed') {
        console.log('dismissed the install banner')
        installFlag = false;
      } else {
        console.log('app is successfully installed')
      }
    });
  }
});

function urlBase64ToUint8Array(base64String) {
  /* eslint-disable */
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
  /* eslint-disable */
};

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  let reg;
  navigator.serviceWorker.ready
    .then((swreg) => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then((sub) => {
      if (sub === null) {
        // Create a new subscription
        const vapidPublicKey = 'BMWbv3dx9H-0kkZfdAIiTcJ5fhNm-Hz_wCs3jE_H9OZM0c7uAV4MHCK2oHMia2CldbETmP1MyNYOK9omy_j2PTA';
        const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey,
        });
      }
      return {};
    })
    .then((newSub) => {
      if (JSON.stringify(newSub).includes('endpoint')) {
        console.log(JSON.stringify(newSub));
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission((result) => {
    if (result === 'granted') {
      configurePushSub();
    }
  });
}