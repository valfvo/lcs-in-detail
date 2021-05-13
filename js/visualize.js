import { lcsNaive } from 'lcs-algorithms.mjs';

const visualizeButton = document.querySelector('.visualize-button'); 

visualizeButton.onclick = () => {
  const sequenceOne = document.querySelector('.s1').value;
  const sequenceTwo = document.querySelector('.s2').value;

  if (sequenceOne === '' || sequenceTwo === '') return;

  console.log(lcsNaive(sequenceOne, sequenceTwo));
};
