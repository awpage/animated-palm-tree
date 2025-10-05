const db = ref();

const deviceID = ref();
const devices = ref<any[]>([]);
const messages = ref<any[]>([])

export default function useClientStorage() {
  if (!import.meta.client) return;

  const findUserDeviceId = async () => {
    const indexKey = (
      (await indexedDB.find({ store: DEVICE_KEY, key: DEVICE_KEY })) as any
    )?.value.id;

    let key = localStorage.getItem(DEVICE_KEY) || indexKey || null;

    try {
      if (!key) {
        const resp = await useAsyncData(() => $fetch("/api/device-to-device/deviceid"));

        if (resp.data.value) {
          key = resp.data.value.pin!;
          localStorage.setItem(DEVICE_KEY, key!);
          indexedDB.add({
            store: DEVICE_KEY,
            item: { id: DEVICE_KEY, val: { id: key, token: "" } },
          });

          log();
        }

        await 
          $fetch("/api/device-to-device/deviceid", {
            method: "POST",
            body: { id: key, token: key },
          })
      }

      deviceID.value = key;
    } catch (error: any) {
      alert(error.message.split(":")[1] ?? "An error occurred");
    }
  };

  const findDevices = async () => {
    const indexDevices = (
      (await indexedDB.find({ store: STORAGE_KEY, key: STORAGE_KEY })) as any
    )?.value;

    devices.value = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || indexDevices || []
    );
  };

  const addDeviceToStore = async (newVal: any) => {
    devices.value = newVal;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
    indexedDB.add({
      store: STORAGE_KEY,
      item: { id: STORAGE_KEY, val: JSON.stringify(newVal) },
    });
  };

  const findAllMessages = async () => {
    const indexMessages = ((await indexedDB.find({ store: MESSAGE_KEY, key: MESSAGE_KEY })) as any)?.value
    messages.value = JSON.parse(localStorage.getItem(MESSAGE_KEY) || indexMessages || [])
  }

  const addMessageToStore = async (newVal: any) => {
    messages.value = newVal
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(newVal));

    indexedDB.add({
      store: MESSAGE_KEY,
      item: { id: MESSAGE_KEY, val: JSON.stringify(newVal)}
    })
  }

  const indexedDB = {
    init: () => {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (e) => reject(e);

        request.onsuccess = (e: any) => {
          db.value = e.target.result;
          resolve(e.target.result);
        };

        request.onupgradeneeded = (e: any) => {
          db.value = e.target.result;
          db.value.createObjectStore(STORAGE_KEY, { keyPath: "id" });
          db.value.createObjectStore(DEVICE_KEY, { keyPath: "id" });
          db.value.createObjectStore(MESSAGE_KEY, { keyPath: "id" });

          resolve(e.target.result);
        };
      });
    },

    find: async ({ store, key }: { store: string; key?: string }) => {
      if (db.value === undefined) {
        await indexedDB.init(); // Ensure init is async if needed
      }

      const transaction = db.value.transaction([store], "readonly");
      const objectStore = transaction.objectStore(store);

      return new Promise((resolve, reject) => {
        if (!key) {
          // Fetch all records
          const request = objectStore.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } else {
          // Find record by key using a cursor
          const request = objectStore.openCursor();
          request.onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              if (cursor.key == key) {
                resolve(cursor.value);
              } else {
                cursor.continue();
              }
            } else {
              resolve(null);
            }
          };
          request.onerror = () => reject(request.error);
        }
      });
    },

    add: ({
      store,
      item,
    }: {
      store: string;
      item: { id: string; val: any };
    }) => {
      if (db.value === undefined) indexedDB.init();

      let transaction = db.value.transaction(store, "readwrite");

      transaction.oncomplete = () => "Done";
      transaction.onerror = (e: any) => {
        throw Error(e);
      };

      let objectStore = transaction.objectStore(store);
      objectStore.put({ id: item.id, value: item.val });
    },
  };

  onMounted(() => {
    if (db.value === undefined) {
      indexedDB.init().then(() => {
        findUserDeviceId();
      });
    } else {
      findUserDeviceId();
    }

    findDevices();
    findAllMessages();
    log();
  });

  watch(deviceID, (newVal) => {
    localStorage.setItem(DEVICE_KEY, newVal);
    indexedDB.add({
      store: DEVICE_KEY,
      item: { id: DEVICE_KEY, val: { id: newVal, token: "" } },
    });
  });

  return {
    deviceID,
    devices,
    messages,
    indexedDB,
    addDeviceToStore,
    findAllMessages,
    addMessageToStore,
  };
}
