// UPDATE THIS ARRAY: Put the exact file names of the images inside your "Images" folder here
const images = [
  "Images/screenshot1.png",
  "Images/photo2.jpg",
  "Images/image3.jpg",
  "Images/pic4.png",
];

const imgElement = document.getElementById("slideshow-img");
const prevBtn = document.getElementById("prevBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = -1;
let history = []; // Keeps track of seen images so 'Prev' works during random playback
let timer;
let isPlaying = true;
const intervalTime = 10000; // 10 seconds

// Function to pick a random image different from the current one
function getRandomIndex() {
  if (images.length <= 1) return 0;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === currentIndex);
  return newIndex;
}

// Function to handle the dissolve transition and update the image
function updateImage(index) {
  // Fade out
  imgElement.style.opacity = 0;

  // Wait for the CSS fade out transition to complete before changing the source
  setTimeout(() => {
    imgElement.src = images[index];
    currentIndex = index;

    // Wait a tiny bit for the image to load, then fade back in
    imgElement.onload = () => {
      imgElement.style.opacity = 1;
    };
  }, 1000); // Matches the 1s transition in CSS
}

// Advance to the next random image
function nextImage() {
  if (currentIndex !== -1) {
    history.push(currentIndex); // Save current to history before changing
  }
  const nextIdx = getRandomIndex();
  updateImage(nextIdx);
}

// Go back to the previously viewed image
function prevImage() {
  if (history.length > 0) {
    const prevIdx = history.pop(); // Get the last seen image
    updateImage(prevIdx);
  } else {
    // If no history, just pick a random one
    nextImage();
  }
}

// Start the automatic slideshow timer
function startSlideshow() {
  timer = setInterval(nextImage, intervalTime);
}

// Stop the automatic slideshow timer
function stopSlideshow() {
  clearInterval(timer);
}

// Event Listeners for the buttons
nextBtn.addEventListener("click", () => {
  nextImage();
  if (isPlaying) {
    stopSlideshow();
    startSlideshow(); // Reset timer so it doesn't change immediately after a click
  }
});

prevBtn.addEventListener("click", () => {
  prevImage();
  if (isPlaying) {
    stopSlideshow();
    startSlideshow(); // Reset timer
  }
});

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopSlideshow();
    playPauseBtn.innerText = "Play";
    isPlaying = false;
  } else {
    nextImage(); // Immediately show the next one when resuming
    startSlideshow();
    playPauseBtn.innerText = "Pause";
    isPlaying = true;
  }
});

// Initialize the very first image when the page loads
if (images.length > 0) {
  nextImage();
  startSlideshow();
} else {
  console.error(
    "Please add image file paths to the 'images' array in script.js",
  );
}
