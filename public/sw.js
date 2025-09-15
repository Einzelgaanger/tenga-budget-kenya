// Service Worker for Tenga Budget Kenya Survey
// Provides offline caching and background sync for survey responses

const CACHE_NAME = 'tenga-survey-v1';
const STATIC_CACHE = 'tenga-static-v1';
const DYNAMIC_CACHE = 'tenga-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/index-D1rN0Hyu.css',
  '/assets/index-PeOKXSnu.js',
  '/assets/sampleData-DDsgA9Jx.js',
  '/assets/ui-DCtuquWA.js',
  '/assets/vendor-qQ1Ik9s-.js',
  '/assets/xlsx-C77sefbV.js',
  '/favicon.ico',
  '/favicon.svg',
  '/placeholder.svg',
  '/robots.txt',
  '/site.webmanifest'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(request);
        })
    );
    return;
  }

  // For static assets, try cache first
  if (STATIC_FILES.some(file => url.pathname === file)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // For other requests, try network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            // For SPA routes, serve index.html
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for survey submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'survey-submission') {
    console.log('Background sync: Processing queued survey submissions');
    event.waitUntil(processQueuedSubmissions());
  }
});

// Process queued survey submissions
async function processQueuedSubmissions() {
  try {
    const submissions = await getQueuedSubmissions();
    
    for (const submission of submissions) {
      try {
        const response = await fetch('/api/submit-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        });

        if (response.ok) {
          console.log('Successfully submitted queued feedback:', submission.id);
          await removeQueuedSubmission(submission.id);
        } else {
          console.error('Failed to submit queued feedback:', submission.id);
        }
      } catch (error) {
        console.error('Error submitting queued feedback:', submission.id, error);
      }
    }
  } catch (error) {
    console.error('Error processing queued submissions:', error);
  }
}

// Queue survey submission for background sync
async function queueSubmission(data) {
  try {
    const submission = {
      id: Date.now().toString(),
      data: data,
      timestamp: new Date().toISOString()
    };
    
    const submissions = await getQueuedSubmissions();
    submissions.push(submission);
    
    await new Promise((resolve) => {
      const request = indexedDB.open('SurveyQueue', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('submissions')) {
          db.createObjectStore('submissions', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['submissions'], 'readwrite');
        const store = transaction.objectStore('submissions');
        
        const putRequest = store.put(submission);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => resolve();
      };
      
      request.onerror = () => resolve();
    });
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('survey-submission');
    }
  } catch (error) {
    console.error('Error queuing submission:', error);
  }
}

// Get queued submissions from IndexedDB
async function getQueuedSubmissions() {
  return new Promise((resolve) => {
    const request = indexedDB.open('SurveyQueue', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['submissions'], 'readonly');
      const store = transaction.objectStore('submissions');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
      getAllRequest.onerror = () => resolve([]);
    };
    
    request.onerror = () => resolve([]);
  });
}

// Remove queued submission after successful submission
async function removeQueuedSubmission(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('SurveyQueue', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}

// Expose queueSubmission function to the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'QUEUE_SUBMISSION') {
    queueSubmission(event.data.data);
  }
});
