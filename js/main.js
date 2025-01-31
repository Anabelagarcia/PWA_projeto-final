import './style.css';

const cameraView = document.querySelector("#camera--view"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  switchCameraButton = document.getElementById("switch-camera"),
  photoTitleInput = document.getElementById("photo-title");

let cameraMode = "user";
const lastPhotos = [];

const constraints = () => ({ video: { facingMode: cameraMode }, audio: false });

// Abrir Banco de Dados (IndexedDB)
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("cameraDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salvar foto no IndexedDB
async function savePhoto(photoDataObj) {
  const db = await openDB();
  const transaction = db.transaction("photos", "readwrite");
  const store = transaction.objectStore("photos");
  store.add(photoDataObj);
}

// Carregar fotos do IndexedDB
async function loadPhotos() {
  const db = await openDB();
  const transaction = db.transaction("photos", "readonly");
  const store = transaction.objectStore("photos");
  const request = store.getAll();
  request.onsuccess = () => {
    const photos = request.result.slice(-10);
    lastPhotos.length = 0;
    lastPhotos.push(...photos);
    updatePhotoGallery();
  };
}

// Atualizar galeria de fotos
function updatePhotoGallery() {
  const gallery = document.getElementById("photo-gallery");
  if (!gallery) return;

  // Limpa a galeria antes de adicionar novas fotos
  gallery.innerHTML = "";

  lastPhotos.forEach((photoDataObj) => {
    const img = document.createElement("img");
    img.src = photoDataObj.photo;
    img.classList.add("photo-preview");

    const title = document.createElement("h3");
    title.innerText = `Título: ${photoDataObj.title || "Sem título"}`;

    // Criar um contêiner para a foto e título
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo-container");
    photoContainer.appendChild(img);
    photoContainer.appendChild(title);

    gallery.appendChild(photoContainer);
  });
}

// Iniciar a câmera
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints())
    .then((stream) => {
      cameraView.srcObject = stream;
    })
    .catch((error) => console.error("Ocorreu um erro ao acessar a câmera:", error));
}

// Tirar foto
cameraTrigger.onclick = async function () {
  const photoTitle = photoTitleInput.value.trim();
  if (!photoTitle) {
    alert("Por favor, insira um título antes de tirar a foto.");
    return;
  }

  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  const photoData = cameraSensor.toDataURL("image/webp");

  const photoDataObj = {
    title: photoTitle,
    photo: photoData,
    timestamp: new Date().toISOString()
  };

  lastPhotos.push(photoDataObj);
  if (lastPhotos.length > 3) lastPhotos.shift();

  await savePhoto(photoDataObj);
  updatePhotoGallery();
};

// Alternar câmera entre frontal e traseira
switchCameraButton.onclick = function () {
  cameraMode = cameraMode === "user" ? "environment" : "user";
  cameraStart();
};

// Iniciar ao carregar a página
window.addEventListener("load", () => {
  cameraStart();
  loadPhotos();
});
