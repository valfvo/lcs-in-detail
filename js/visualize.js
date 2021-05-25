let lcsWorker = createLcsWorker();
let isWorkerRunning = false;

const visualizeButton = document.querySelector('.visualize-button');

visualizeButton.onclick = () => {
  const activeSlide = document.querySelector('.active-slide');

  const sequenceOne = document.querySelector('.s1').value;
  const sequenceTwo = document.querySelector('.s2').value;

  if (sequenceOne === '' || sequenceTwo === '') return;

  const algorithmUsed = activeSlide.dataset.algorithm;

  if (isWorkerRunning) {
    lcsWorker.terminate();
    lcsWorker = createLcsWorker();
  }   

  isWorkerRunning = true;

  lcsWorker.postMessage(
    {
      algorithm: algorithmUsed,
      sequenceOne: sequenceOne,
      sequenceTwo: sequenceTwo
    }
  );

  if (algorithmUsed === 'lcs-naive') {
    const naiveContent = document.querySelector('.naive-view-content');
    naiveContent.innerHTML = '';
  }
};

const naiveContent = document.querySelector('.naive-view-content');

function onNaiveTrace(trace) {
  naiveContent.innerHTML += trace;
}

function createLcsWorker() {
  let worker = new Worker('js/lcs-algorithms.js');
  worker.onmessage = onWorkerMessage;

  return worker;
}

function onWorkerMessage(e) {
  if (e.data.type === 'trace') {
    onNaiveTrace(e.data.trace);
    return;
  }

  isWorkerRunning = false;

  const activeSlide = document.querySelector('.active-slide');

  const [result, time, trace] = e.data;

  const traceContent = activeSlide.querySelector('.slide-content');
  traceContent.innerHTML = trace.join('');

  // console.log(trace.join(''));

  const resultContent = activeSlide.querySelector('.js-result-content');
  resultContent.innerHTML = result;

  const timeContent = activeSlide.querySelector('.js-time-content');
  let roundedTime = Math.round((time + Number.EPSILON) * 100) / 100;
  timeContent.innerHTML = roundedTime + ' ms';
};
