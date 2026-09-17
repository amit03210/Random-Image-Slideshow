// --- UPDATE THESE TWO VARIABLES ---
const githubUsername = "amit03210";
const repoName = "Random-Image-Slideshow";
const folderName = "Images"; // Make sure this exactly matches your folder name

// The GitHub API URL to read the folder contents
const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${folderName}`;

let images = [];

const imgElement = document.getElementById("slideshow-img");
const prevBtn = document.getElementById("prevBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = -1;
let history = [];
let timer;
let isPlaying = true;
const intervalTime = 10000; // 10 seconds

// 1. Automatically fetch the image list from the GitHub API
fetch(apiUrl)
  .then((response) => {
    if (!response.ok)
      throw new Error("Could not fetch folder. Check username and repo name.");
    return response.json();
  })
  .then((data) => {
    // Filter out non-image files and get the raw download URLs
    images = data
      .filter((file) => file.name.match(/\.(jpe?g|png|gif|webp)$/i))
      .map((file) => file.download_url); // Use GitHub's raw image link

    if (images.length > 0) {
      nextImage();
      startSlideshow();
    } else {
      console.error("No images found in the 'Images' folder on GitHub.");
    }
  })
  .catch((error) => console.error("Error loading images:", error));

// 2. Logic to pick a random image
function getRandomIndex() {
  if (images.length <= 1) return 0;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === currentIndex);
  return newIndex;
}

// 3. Handle the dissolve transition
function updateImage(index) {
  imgElement.style.opacity = 0;

  setTimeout(() => {
    imgElement.src = images[index];
    currentIndex = index;

    imgElement.onload = () => {
      imgElement.style.opacity = 1;
    };
  }, 1000);
}

function nextImage() {
  if (currentIndex !== -1) {
    history.push(currentIndex);
  }
  const nextIdx = getRandomIndex();
  updateImage(nextIdx);
}

function prevImage() {
  if (history.length > 0) {
    const prevIdx = history.pop();
    updateImage(prevIdx);
  } else {
    nextImage();
  }
}

function startSlideshow() {
  timer = setInterval(nextImage, intervalTime);
}

function stopSlideshow() {
  clearInterval(timer);
}

// 4. Button Event Listeners
nextBtn.addEventListener("click", () => {
  nextImage();
  if (isPlaying) {
    stopSlideshow();
    startSlideshow();
  }
});

prevBtn.addEventListener("click", () => {
  prevImage();
  if (isPlaying) {
    stopSlideshow();
    startSlideshow();
  }
});

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopSlideshow();
    playPauseBtn.innerText = "Play";
    isPlaying = false;
  } else {
    nextImage();
    startSlideshow();
    playPauseBtn.innerText = "Pause";
    isPlaying = true;
  }
});
