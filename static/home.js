dropperArea = document.getElementsByClassName('dropper')[0];
dropperArea.addEventListener('dragenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.add('dragover');
}, false);
dropperArea.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
}, false);
dropperArea.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('dragover');
}, false);
dropperArea.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    dropperArea.innerHTML = '';
    this.classList.remove('dragover');
    var files = e.dataTransfer.files;
    var count = files.length;
    if (count > 0) {
        handleFiles(files);
    }
}, false);


function resize(img) {
    var maxWidth = dropperArea.clientWidth;
    var maxHeight = dropperArea.clientHeight;
    var width = img.width;
    var height = img.height;

    var aspectRatio = width / height;

    if (width > height) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
    } else {
        height = maxHeight;
        width = maxHeight * aspectRatio;
    }

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width-30;
    canvas.height = height-30;

    ctx.drawImage(img, 0, 0, width, height);

    var resizedImg = document.createElement('img');
    resizedImg.src = canvas.toDataURL('image/jpg');

    dropperArea.appendChild(resizedImg);
};

function handleFiles(files) {
    // clear the dropper area and input file
    var dropperArea = document.getElementsByClassName('dropper')[0];
    var fileInput = document.getElementById('fileInput');
    
    var file = files[0];
    var imageType = /image.*/;
    if (!file.type.match(imageType)) {
        return;
    }
    processButton.disabled = false;
    dropperArea.innerHTML = '';

    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            resize(img);
        }
    };
    reader.readAsDataURL(file);
}

var uploadButton = document.querySelector('.uploadButton');
uploadButton.addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    fileInput.click();
});

// Add an event listener to the file input
var fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function(e) {
    handleFiles(e.target.files);
});

var processButton = document.querySelector('.model1'); 
var saveButton = document.getElementById('saveButton');

processButton.addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        sendFileToBackend(file , 'model1');
    }
});


function sendFileToBackend(file, model) {
    showProcessingAlert("Processing..."); 
    
    var formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.processed_image) {
            showProcessedImage(data.processed_image);
            processButton.disabled = true;
            saveButton.disabled = false;
            processedImageData = data.processed_image;
            alert = document.getElementById('alert');
            alert.classList.remove('show');

        } else {
            console.error('Error processing the file:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showProcessedImage(imagePath) {
    var dropperArea = document.getElementsByClassName('dropper')[0];
    dropperArea.innerHTML = '';

    var img = new Image();
    img.src = imagePath + '?timestamp=' + new Date().getTime();

    img.onload = function() {
        resize(img);
    };
}



function showProcessingAlert(text) {
    alert = document.getElementById('alert');
    alert.classList.add('show');
    alert.innerHTML = text;
}

