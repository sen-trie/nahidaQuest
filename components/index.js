import { patchNotes } from '../modules/drawUI.js'

const changeSize = (biggerIndex, smallerIndex) => {
    const biggerEle = document.getElementById(`card-img-${biggerIndex}`);
    biggerEle.style.width = '84%';
    biggerEle.style.filter = 'brightness(1)';
    biggerEle.play();

    const smallerEle = document.getElementById(`card-img-${smallerIndex}`);
    smallerEle.style.width = '15%';
    smallerEle.style.filter = 'brightness(0.1)';
}

const revertSize = (biggerIndex, smallerIndex) => {
    const biggerEle = document.getElementById(`card-img-${biggerIndex}`);
    biggerEle.style.width = '49.75%';
    biggerEle.style.filter = 'brightness(0.6)';
    biggerEle.pause();
    biggerEle.currentTime = 0; 

    const smallerEle = document.getElementById(`card-img-${smallerIndex}`);
    smallerEle.style.width = '49.75%';
    smallerEle.style.filter = 'brightness(0.6)';
}

const revealBlock = (eleIndex) => {
    const titleEle = document.getElementById(`title-block-${Math.ceil(eleIndex / 2)}`);
    titleEle.style.opacity = 1;
}

const hideBlock = (eleIndex) => {
    const titleEle = document.getElementById(`title-block-${Math.ceil(eleIndex / 2)}`);
    titleEle.style.opacity = 0;
}

for (let i = 1; i < 9; i++) {
    const videoElement = document.getElementById(`card-img-${i}`);
    videoElement.addEventListener('mouseover', () => {
        changeSize(i, i % 2 === 0 ? i - 1 : i + 1);
        revealBlock(i);
    });

    videoElement.addEventListener('mouseout', () => {
        revertSize(i, i % 2 === 0 ? i - 1 : i + 1);
        hideBlock(i);
    })

    videoElement.addEventListener('ended', () => {
        videoElement.currentTime = 0; 
        videoElement.play(); 
      });
}

patchNotes(document.getElementById('patch-notes'), false, true);
