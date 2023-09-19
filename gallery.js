const backButton = document.querySelector('.back-btn')
const galleryWrapper = document.querySelector('.gallery-wrapper')


backButton.addEventListener('click', () => {
    location.assign('/')
})

setTimeout(() => {
    if (db) {
        const dbTransaction = db.transaction('video', 'readonly')
        const videoStore = dbTransaction.objectStore('video')
        const videoRequest = videoStore.getAll()
        videoRequest.onsuccess = function (e) {
            const allVideos = e.target.result
            allVideos.forEach(video => {
                const videoURL = URL.createObjectURL(video.blobData)
                const card = document.createElement('div')
                card.setAttribute('class', 'card')
                card.setAttribute('id', `${video.id}`)
                card.innerHTML = `
                    <video autoplay loop src="${videoURL}"></video>
                    <button class="delete-btn">Delete</button>
                    <button class="download-btn">Download</button>
                `
                galleryWrapper.appendChild(card)
                const deleteBtn = card.querySelector('.delete-btn')
                deleteBtn.addEventListener('click', deleteBtnHandler)
                const downloadBtn = card.querySelector('.download-btn')
                downloadBtn.addEventListener('click', () => downloadBtnHandler(videoURL))
            });

        }

        const dbTransactionForImages = db.transaction('image', 'readonly')
        const imageStore = dbTransactionForImages.objectStore('image')
        const imageRequest = imageStore.getAll()
        imageRequest.onsuccess = function (e) {
            const allImages = e.target.result
            allImages.forEach((image) => {
                const card = document.createElement('div')
                card.setAttribute('class', 'card')
                card.setAttribute('id', `${image.id}`)
                card.innerHTML = `
                    <img id="${image.id}" src="${image.url}"></video>
                    <button class="delete-btn">Delete</button>
                    <button class="download-btn">Download</button>
                `
                galleryWrapper.appendChild(card)
                const deleteBtn = card.querySelector('.delete-btn')
                deleteBtn.addEventListener('click', deleteBtnHandler)
                const downloadBtn = card.querySelector('.download-btn')
                downloadBtn.addEventListener('click', () => downloadBtnHandler(image.url))
            })
        }

    }
}, 100);



function deleteBtnHandler(e) {
    const card = e.target.parentElement;
    const cardId = card.getAttribute('id')
    const identifier = cardId.slice(0, 3)
    if (identifier === 'vid') {
        const dbTransaction = db.transaction('video', 'readwrite')
        const videoStore = dbTransaction.objectStore('video')
        videoStore.delete(cardId)
    } else if (identifier === 'img') {
        const dbTransaction = db.transaction('image', 'readwrite')
        const imageStore = dbTransaction.objectStore('image')
        imageStore.delete(cardId)
    }

    e.target.parentElement.remove()
}

function downloadBtnHandler(url) {
    const a = document.createElement('a')
    a.href = url
    a.download = 'video'
    a.click()
}