const images = [
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg',
    './images/7.jpg',
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg',
    './images/7.jpg',
    './images/7.jpg',
    './images/7.jpg',
];

const folder = document.querySelector('.folder');
const imageGallery = document.querySelector('.image-gallery');
const trashImageGallery = document.querySelector('.trash-image-gallery');
const myImage = document.querySelector('.my-images');
const trash = document.querySelector('.trash');
const camera = document.querySelector('.camera')

let isGalleryView = false;
const trashImages = [];

function createImageElement(image, isTrash = false) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const imgElement = document.createElement('img');
    imgElement.src = image;
    imgElement.alt = 'Image';

    if (isTrash) {
        const restoreButton = document.createElement('button');
        restoreButton.innerHTML = '<i class="fa-solid fa-undo"></i>';
        restoreButton.classList.add('restore-button');
        restoreButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to restore this image?")) {
                restoreImage(image);
            }
        });

        const permanentDeleteButton = document.createElement('button');
        permanentDeleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        permanentDeleteButton.classList.add('permanent-delete-button');
        permanentDeleteButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to permanently delete this image?")) {
                permanentDeleteImage(image);
            }
        });

        imageContainer.appendChild(restoreButton);
        imageContainer.appendChild(permanentDeleteButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.classList.add('delete-button');

        imgElement.addEventListener('click', () => {
            showFullscreenImage(image);
        });

        deleteButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete this image?")) {
                imageContainer.remove();

                const index = images.indexOf(image);
                if (index > -1) {
                    images.splice(index, 1);
                }

                trashImages.push(image);
                updateTrashGallery();
            }
        });

        imageContainer.appendChild(deleteButton);
    }

    imageContainer.appendChild(imgElement);
    return imageContainer;
}

function permanentDeleteImage(image) {
    const index = trashImages.indexOf(image);
    if (index > -1) {
        trashImages.splice(index, 1);
    }

    updateTrashGallery();
}

function restoreImage(image) {
    const index = trashImages.indexOf(image);
    if (index > -1) {
        trashImages.splice(index, 1);
    }

    images.push(image);

    updateTrashGallery();
    updateGallery();
}

function updateTrashGallery() {
    trashImageGallery.innerHTML = '';

    if (trashImages.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "Trash is empty";
        emptyMessage.classList.add('empty-message');
        trashImageGallery.appendChild(emptyMessage);
    } else {
        trashImages.forEach(image => {
            trashImageGallery.appendChild(createImageElement(image, true));
        });
    }
}

function updateGallery() {
    imageGallery.innerHTML = '';
    images.forEach(image => {
        imageGallery.appendChild(createImageElement(image));
    });
}

function showFullscreenImage(image) {
    const existingFullscreen = document.querySelector('.fullscreen-container');
    if (existingFullscreen) {
        existingFullscreen.remove();
    }

    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.classList.add('fullscreen-container');

    const fullscreenImage = document.createElement('img');
    fullscreenImage.src = image;
    fullscreenImage.classList.add('fullscreen-image');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('fullscreen-delete-button');
    deleteButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this image?")) {
            const index = images.indexOf(image);
            if (index > -1) {
                images.splice(index, 1);
            }

            trashImages.push(image);
            updateGallery();
            updateTrashGallery();

            fullscreenContainer.remove();
            document.body.style.overflow = '';
        }
    });

    const leftArrow = document.createElement('i');
    leftArrow.classList.add('fa-solid', 'fa-arrow-left');
    leftArrow.classList.add('arrow', 'left-arrow');

    const rightArrow = document.createElement('i');
    rightArrow.classList.add('fa-solid', 'fa-arrow-right');
    rightArrow.classList.add('arrow', 'right-arrow');

    fullscreenContainer.appendChild(leftArrow);
    fullscreenContainer.appendChild(rightArrow);
    fullscreenContainer.appendChild(fullscreenImage);
    fullscreenContainer.appendChild(deleteButton);
    document.body.appendChild(fullscreenContainer);

    document.body.style.overflow = 'hidden';

    fullscreenImage.addEventListener('click', () => {
        fullscreenContainer.remove();
        document.body.style.overflow = ''; 
    });

    leftArrow.addEventListener('click', () => {
        navigateFullscreenImage(-1);
    });

    rightArrow.addEventListener('click', () => {
        navigateFullscreenImage(1);
    });


    fullscreenImage.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    });

    fullscreenImage.addEventListener('touchend', (event) => {
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;
        if (Math.abs(deltaX) > 50) {
            navigateFullscreenImage(deltaX > 0 ? -1 : 1);
        }
    });

    document.addEventListener('keydown', handleKeyboardNavigation);

    function navigateFullscreenImage(direction) {
        const currentIndex = images.indexOf(image);
        let newIndex = (currentIndex + direction + images.length) % images.length;
        showFullscreenImage(images[newIndex]);
    }

    function handleKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft') {
            navigateFullscreenImage(-1);
        } else if (event.key === 'ArrowRight') {
            navigateFullscreenImage(1);
        } else if (event.key === 'Escape') {
            fullscreenContainer.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyboardNavigation);
        }
    }
}


function switchToGalleryView() {
    if (!isGalleryView) {
        updateGallery();
        myImage.style.display = 'none';
        imageGallery.style.display = 'grid';
        trashImageGallery.style.display = 'none';
        isGalleryView = true;
    }
}

function switchToTrashView() {
    if (!isGalleryView) {
        updateTrashGallery();
        trashImageGallery.style.display = 'grid'; 
        imageGallery.style.display = 'none'; 
        myImage.style.display = 'none';
        isGalleryView = true;
    }
}

function switchToMainView() {
    if (isGalleryView) {
        imageGallery.innerHTML = '';
        trashImageGallery.innerHTML = '';
        myImage.style.display = 'flex';
        imageGallery.style.display = 'none'; 
        trashImageGallery.style.display = 'none'; 
        isGalleryView = false;
    }
}

folder.addEventListener('dblclick', switchToGalleryView);

trash.addEventListener('dblclick', switchToTrashView);

const backButton = document.querySelector('.fa-arrow-left-long');
backButton.addEventListener('click', switchToMainView);

trashImageGallery.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
        showFullscreenImage(event.target.src);
    }
});
