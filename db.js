let db;

let openRequest = indexedDB.open("myDatabase")

openRequest.addEventListener('success', () => {
    console.log('DB Success');
    db = openRequest.result
})

openRequest.addEventListener('error', (e) => {
    console.log(e, 'DB Error')
})

openRequest.addEventListener('upgradeneeded', () => {
    console.log('DB upgradeNeeded');
    db = openRequest.result

    db.createObjectStore("video", { keyPath: "id" })
    db.createObjectStore("image", { keyPath: "id" })
})