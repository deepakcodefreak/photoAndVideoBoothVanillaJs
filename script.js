const video = document.querySelector('video')
const recordActionContainer = document.querySelector('.record-action-container')
const captureActionContainer = document.querySelector('.capture-action-container')
const recordAction = document.querySelector('.record-action')
const captureAction = document.querySelector('.capture-action')
const timerContainer = document.querySelector('.timer-container')
const filterList = document.querySelectorAll('.filter')
const filterOverlay = document.querySelector('.filter-overlay')

const constraints = {
    video: true,
    audio: false
}

let isRecording = false;
let recorder;
let chunks = []
let timerId;
let counter = 0
let selectedFilterColor = 'rgba(0, 0, 0, 0)';

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream
    recorder = new MediaRecorder(stream)
    recorder.addEventListener('start', () => {
        chunks = []
        startTimer()
    })
    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data)
    })
    recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        if (db) {
            let dbTransaction = db.transaction('video', 'readwrite')
            const videoStore = dbTransaction.objectStore('video')
            videoStore.add({
                blobData: blob,
                id: `vid-${crypto.randomUUID()}`
            })
        }
        stopTimer()
    })
}).catch((err) => {
    console.log('Error', err)
})

recordActionContainer.addEventListener('click', () => {
    isRecording = !isRecording
    if (isRecording) {
        recordAction.classList.add('animate-record')
        recorder.start()
    } else {
        recordAction.classList.remove('animate-record')
        recorder.stop()
    }
})


function startTimer() {
    timerContainer.style.display = "block"
    function displayTime() {
        counter += 1;
        let totalSeconds = counter;
        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds = totalSeconds % 3600
        let minutes = Math.floor(totalSeconds / 60)
        totalSeconds = totalSeconds % 60
        let seconds = totalSeconds

        hours = (hours < 10) ? `0${hours}` : hours
        minutes = (minutes < 10) ? `0${minutes}` : hours
        seconds = (seconds < 10) ? `0${seconds}` : seconds

        timerContainer.innerText = `${hours}:${minutes}:${seconds}`

    }
    timerId = setInterval(displayTime, 1000);
}

function stopTimer() {
    timerContainer.style.display = "none"
    counter = 0
    clearInterval(timerId)
}

captureActionContainer.addEventListener('click', () => {
    captureAction.classList.add('animate-capture')
    const canvas = document.createElement('canvas')
    const video = document.querySelector('video')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedFilterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const imageURL = canvas.toDataURL()
    if (db) {
        let dbTransaction = db.transaction('image', 'readwrite')
        const imageStore = dbTransaction.objectStore('image')
        imageStore.add({
            url: imageURL,
            id: `img-${crypto.randomUUID()}`
        })
    }
    setTimeout(() => {
        captureAction.classList.remove('animate-capture')
    }, 1000);
})


filterList.forEach((filter) => {
    filter.addEventListener('click', () => {
        selectedFilterColor = getComputedStyle(filter).getPropertyValue('background-color')
        filterOverlay.style.backgroundColor = selectedFilterColor
    })
})


