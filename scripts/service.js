const hostname = 'https://private-mp3-converter-a578b023d692.herokuapp.com/';

let url, videoInformations;

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", getInfos);

const input = document.getElementById("inputUrl");
input.addEventListener("input", onInputChange)

function download() {
  url = input.value;
  downloadBtn.innerHTML = `
  <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
  </div>
  `
  fetch(`${hostname}download?url=${url}`)
    .then(res => {
        if(!res.ok) {
            throw new Error(`ERROR: ${res.statusText}`)
        }
        return res.blob();
    })
    .then((blob) => {
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = `${videoInformations.videoDetails.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlBlob);
      downloadBtn.innerText = 'Download';
    })
    .catch((err) => {
        downloadBtn.innerHTML = 'Convert'
    });
}

function getInfos() {
    url = input.value;
    downloadBtn.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `
    fetch(`${hostname}info?url=${url}`)
        .then(res => {
            if(!res.ok) {
                throw new Error(`ERROR: ${res.statusText}`)
            }
            return res.json();
        })
        .then(body => {
            videoInformations = body;
            downloadBtn.innerText = 'Download';
            downloadBtn.removeEventListener('click', getInfos);
            downloadBtn.addEventListener('click', download);
        })
        .catch(err => {
            downloadBtn.innerHTML = 'Convert'
            console.log(err);
        });
}

function getTitle() {
    let title
    try {
        title = videoInformations.videoDetails.title;
    } catch (err) {
        title = videoInformations.videoDetails.videoId;
    }
    return title 
}

function onInputChange() {
    if(!input.value) {
        downloadBtn.innerText = 'Convert';
        downloadBtn.addEventListener("click", getInfos);
        downloadBtn.addAttribute('disabled');
    } else {
        downloadBtn.removeAttribute('disabled');
    }
}
