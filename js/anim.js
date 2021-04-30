var firstTextArea = document.querySelectorAll('.text-area')[0];

firstTextArea.onfocus = function() {
    let squareAnim = document.querySelector('.square-anim');
    squareAnim.style.opacity = '0.3';
};

firstTextArea.addEventListener('focusout', function() {
    let squareAnim = document.querySelector('.square-anim');
    squareAnim.style.opacity = '0';
});


var secondTextArea = document.querySelectorAll('.text-area')[1];
secondTextArea.onfocus = function() {
    let squareAnim = document.querySelector('.square-anim');
    squareAnim.style.transform = 'translate(1000px, 50px) rotate(15deg)';
    squareAnim.style.opacity = '0.3';
};

secondTextArea.addEventListener('focusout', function() {
    let squareAnim = document.querySelector('.square-anim');
    squareAnim.style.transform = 'translate(400px, 50px) rotate(25deg)';
    squareAnim.style.opacity = '0';
});


