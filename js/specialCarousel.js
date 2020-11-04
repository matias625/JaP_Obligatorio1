var carousel = document.querySelector('.carousel_3D');
var cells = carousel.querySelectorAll('.carousel_3D_cell');
var cellCount = 7; // cellCount set from cells-range input value
var selectedIndex = 0;
var selectedSlot = 0;
var cellWidth = carousel.offsetWidth;
var radius, theta;
// console.log( cellWidth, cellHeight );

function rotateCarousel() {
    var angle = theta * selectedIndex * -1;
    
    carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
        'rotateY(' + angle + 'deg)';

    for (var i = 0; i < cells.length; i++) {
        if (i == selectedSlot) {
            cells[i].style.opacity = 1;
        }
        else {
            cells[i].style.opacity = 0.2;
        }
    }
}

var prevButton = document.querySelector('.carousel-control-prev');
prevButton.addEventListener('click', function () {
    selectedIndex--;
    selectedSlot--;
    if (selectedSlot < 0) {
        selectedSlot = cellCount - 1;
    }
    rotateCarousel();
});

var nextButton = document.querySelector('.carousel-control-next');
nextButton.addEventListener('click', function () {
    selectedIndex++;
    selectedSlot++;
    if (selectedSlot >= cellCount) {
        selectedSlot = 0;
    }
    rotateCarousel();
});

function changeCarousel() {
    // cellCount = cellsRange.value;
    theta = 360 / cellCount;
    var cellSize = carousel.offsetWidth; // cellWidth;
    radius = Math.round((cellSize / 2) / Math.tan(Math.PI / cellCount));
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var cellAngle = theta * i;
        cell.style.transform = 'rotateY' + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
    }

    rotateCarousel();
}


// set initials
changeCarousel();

