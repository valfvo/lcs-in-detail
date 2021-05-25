function linkButtonToPopup(button, popup) {
  button.onclick = () => {
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

function linkButtonsToPopups() {
  const slides = document.querySelectorAll('.slide');

  for (const slide of slides) {
    const explanationButton = slide.querySelector('.explanation-button');
    const popup = slide.querySelector('.popup');

    linkButtonToPopup(explanationButton, popup);
  }

  const lcsInfoButton = document.querySelector('.lcs-info-button');
  const lcsInfoPopup = document.querySelector('.lcs-info-popup');

  linkButtonToPopup(lcsInfoButton, lcsInfoPopup);
}

linkButtonsToPopups();
