const slides = document.querySelectorAll('.slide');
let currentSlideIndex = 0;
let maxSlideIndex = slides.length - 1;

const prev = document.querySelector('.prev');

prev.onclick = () => {
  const currentSlide = slides[currentSlideIndex];
  currentSlide.classList.remove('active-slide');

  if (currentSlideIndex == 0) {
    currentSlideIndex = maxSlideIndex;
  } else {
    --currentSlideIndex;
  }

  const newSlide = slides[currentSlideIndex];
  newSlide.classList.add('active-slide');
};

const next = document.querySelector('.next');

next.onclick = () => {
  const currentSlide = slides[currentSlideIndex];
  currentSlide.classList.remove('active-slide');

  if (currentSlideIndex == maxSlideIndex) {
    currentSlideIndex = 0;
  } else {
    ++currentSlideIndex;
  }

  const newSlide = slides[currentSlideIndex];
  newSlide.classList.add('active-slide');
};

for (const slide of slides) {
  const explanationButton = slide.querySelector('.explanation-button');
  const popup = slide.querySelector('.popup');

  explanationButton.onclick = () => {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  popup.onclick = (e) => {
    if (e.target == popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };
}
