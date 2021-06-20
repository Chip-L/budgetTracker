let db;

const request = window.indexedDB.open("budget", 1);

// taking just the event target (the new open DB request (IDBOpenDBRequest))
request.onupgradeneeded = ({ target }) => {
  // get a reference to the actual DB
  db = target.result;

  // check if store is already created and if not, create it:
  if (db.objectStoreNames.length === 0) {
    // create store (with autoIncrement for index):
    db.createObjectStore("budget", { autoIncrement: true });

    // no indexes created as they are not used.
  }
};

// catch error on open
request.onerror = (event) => {
  console.log(`Whoops! ${event.target.errorCode}`);
};

request.onsuccess = (event) => {
  // get a reference to the actual DB for CheckDatabase
  db = request.result;

  //check online status
  if (navigator.onLine) {
    checkDatabase();
  }
};

function checkDatabase() {
  // Open a transaction on the DB
  let transaction = db.transaction(["budget"], "readwrite");

  // access the store through the transaction:
  let store = transaction.objectStore("budget");

  // get all of the records
  const getAllRecords = store.getAll();

  // if getAll is successful - push up to the DB
  getAllRecords.onsuccess = () => {
    if (getAllRecords.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAllRecords.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          // If our returned response is not empty
          if (res.length !== 0) {
            // Open another transaction to BudgetStore with the ability to read and write
            transaction = db.transaction(["budget"], "readwrite");

            // Assign the current store to a variable
            const currentStore = transaction.objectStore("budget");

            // Clear existing entries because our bulk add was successful
            currentStore.clear();
            console.log("Cleared store");
          }
        });
    }
  };
}

window.addEventListener("online", checkDatabase);

// called from index.js if save fails - adds record to indexedDB
function saveRecord(record) {
  // make a transaction to the DB
  const transaction = db.transaction(["budget"], "readwrite");

  //access the store from the transaction
  const store = transaction.objectStore("budget");

  // add the record
  store.add(record);
}
