const request = window.indexedDB.open("budget", 1);

// taking just the event target (the new open DB request (IDBOpenDBRequest))
request.onupgradeneeded = ({ target }) => {
  // get a reference to the actual DB
  const db = target.result;
  // create store:
  const objectStore = db.createObjectStore("budget", { keyPath: "id" });
  objectStore.createIndex("name", "name");
  objectStore.createIndex("value", "value");
  objectStore.createIndex("date", "date");
};

request.onsuccess = (event) => {
  console.log(request.result.name);
  console.log("event:", event);
  console.log("request.result:", request.result);
};
