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
  fetch(`${window.env.serverURL}/download?url=${url}`)
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

async function getInfos() {
    url = input.value;
    downloadBtn.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `
    await fetch(`${window.env.serverURL}/info?url=${url}`)
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

    const title = document.getElementById('title');
    title.innerText = videoInformations.videoDetails.title;

    const thumbnail = document.getElementById('thumbnailImg');
    thumbnail.setAttribute('src', videoInformations.videoDetails.thumbnails[4].url);
    thumbnail.classList.remove('hidden');
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


