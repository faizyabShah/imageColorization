var brightness = document.getElementById('brightness')
var brightness_label = document.getElementById('brightness-label')
brightness.addEventListener('input', function() {
    brightness_label.innerHTML = brightness.value
}, false);

var contrast = document.getElementById('contrast')
var contrast_label = document.getElementById('contrast-label')
contrast.addEventListener('input', function() {
    contrast_label.innerHTML = contrast.value
}, false);

var hue = document.getElementById('hue')
var hue_label = document.getElementById('hue-label')
hue.addEventListener('input', function() {
    hue_label.innerHTML = hue.value
}, false);

var sat = document.getElementById('sat')
var sat_label = document.getElementById('sat-label')
sat.addEventListener('input', function() {
    sat_label.innerHTML = sat.value
}, false);

var sharp = document.getElementById('sharp')
var sharp_label = document.getElementById('sharp-label')
sharp.addEventListener('input', function() {
    sharp_label.innerHTML = sharp.value
}, false);

brightness.addEventListener('mouseup', function() {
    sendValuesToFlask();
}, false);

contrast.addEventListener('mouseup', function() {
    sendValuesToFlask();
}, false);

hue.addEventListener('mouseup', function() {
    sendValuesToFlask();
}, false);

sat.addEventListener('mouseup', function() {
    sendValuesToFlask();
}, false);

sharp.addEventListener('mouseup', function() {
    sendValuesToFlask();
}, false);


var processedImageData;
var saveButton = document.getElementById('saveButton');

function sendValuesToFlask() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/adjust', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    var data = {
        brightness: brightness.value,
        contrast: contrast.value,
        hue: hue.value,
        sat: sat.value,
        sharp: sharp.value
    };

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            processedImageData = response.processed_image;
            saveButton.disabled = false;
            showProcessedImage(response.processed_image);
        }
    };

    xhr.send(JSON.stringify(data));
}


function downloadProcessedFile() {
    if (processedImageData) {
        // Assuming processedImageData is the path of the image (e.g., "processed.jpg")
        var imagePath = processedImageData;

        // Create a link and trigger download
        var a = document.createElement('a');
        a.href = imagePath;
        a.download = 'processed_image.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        console.error('Invalid image path:', processedImageData);
    }
}


saveButton.addEventListener('click', downloadProcessedFile);