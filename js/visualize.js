let lcsThreads = createLcsThreads();

const visualizeButton = document.querySelector('.visualize-button');

visualizeButton.onclick = visualizeLCS;

function visualizeLCS() {
  const sequenceOne = document.querySelector('.s1').value;
  const sequenceTwo = document.querySelector('.s2').value;

  if (sequenceOne === '' || sequenceTwo === '') return;

  const slides = document.querySelectorAll('.slide');
  for (const slide of slides) {
    removeOldVisualization(slide);

    const algorithmUsed = slide.dataset.algorithm;
    let attachedThread = lcsThreads[algorithmUsed];

    if (attachedThread.isRunning) {
      attachedThread.worker.terminate();
      removeInProgress(slide);

      lcsThreads[algorithmUsed] = createLcsThread();
      attachedThread = lcsThreads[algorithmUsed];
    }

    addInProgress(slide);
    attachedThread.isRunning = true;

    attachedThread.worker.postMessage(
      {
        algorithm: algorithmUsed,
        sequenceOne: sequenceOne,
        sequenceTwo: sequenceTwo
      }
    );
  }
};

function removeOldVisualization(slide) {
  const slideContent = slide.querySelector('.slide-content');
  slideContent.innerHTML = '';

  const slideResultContent = slide.querySelector('.js-result-content');
  slideResultContent.innerHTML = '';

  const slideTimeContent = slide.querySelector('.js-time-content');
  slideTimeContent.innerHTML = '';
}

const naiveContent = document.querySelector('.naive-view-content');

function onNaiveTrace(trace) {
  naiveContent.innerHTML += trace;
}

function createLcsThread() {
  let worker = new Worker('js/lcs-algorithms.js');
  worker.onmessage = onWorkerMessage;

  return {worker: worker, isRunning: false};
}

function createLcsThreads() {
  const slides = document.querySelectorAll('.slide');
  let threads = {};

  for (const slide of slides) {
    threads[slide.dataset.algorithm] = createLcsThread();
  }

  return threads;
}

function onWorkerMessage(e) {
  console.log("worker msg");
  if (e.data.type === 'trace') {
    onNaiveTrace(e.data.trace);
    return;
  }

  const slide =
    document.querySelector(`.slide[data-algorithm=${e.data.algorithm}]`);

  lcsThreads[slide.dataset.algorithm].isRunning = false;

  removeInProgress(slide);

  const [result, time, trace] = [e.data.result, e.data.time, e.data.trace];

  const traceContent = slide.querySelector('.slide-content');
  traceContent.innerHTML = trace.join('');

  const resultContent = slide.querySelector('.js-result-content');
  resultContent.innerHTML = result;

  const timeContent = slide.querySelector('.js-time-content');
  let roundedTime = Math.round((time + Number.EPSILON) * 100) / 100;
  timeContent.innerHTML = roundedTime + ' ms';
};

function addInProgress(slide) {
  const inProgressDiv = document.createElement('div');
  inProgressDiv.classList.add('in-progress');
  inProgressDiv.dataset.elapsed = '0.0';

  const intervalID = setInterval(() => {
    let elapsed = parseFloat(inProgressDiv.dataset.elapsed) + 0.1;
    inProgressDiv.dataset.elapsed = elapsed.toFixed(1);

    inProgressDiv.innerHTML =
      'Calculation in progress... (<span class="in-progress-number">'
      + inProgressDiv.dataset.elapsed
      + '</span>s elapsed)';
  }, 100);

  inProgressDiv.dataset.intervalId = intervalID;

  const slideHeader = slide.querySelector('.slide-header');
  if (slideHeader) slideHeader.appendChild(inProgressDiv);
}

function removeInProgress(slide) {
  const inProgressDiv = slide.querySelector('.in-progress');
  clearInterval(parseInt(inProgressDiv.dataset.intervalId));

  if (inProgressDiv) inProgressDiv.remove();
}

visualizeLCS();
