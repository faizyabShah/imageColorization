import base64
from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from Engine import process_file
from keras.models import load_model
from postprocessing import *
from preprocessing import *

app = Flask(__name__, static_url_path='', static_folder='static')
loaded_model = load_model('flower.h5')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOADS = 'uploads'
IMG_PATH = 'processed/processed.jpg'
app.config['UPLOAD_FOLDER'] = UPLOADS
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    model = request.form['model']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filePath = os.path.join(app.config['UPLOAD_FOLDER'], 'temp.jpg')
        file.save(filePath)
        
        preprocess(filePath)        
        processed = process_file(filePath, model, loaded_model)
        if not processed:
            return jsonify({'error': 'Error processing file'})
        return jsonify({'message': 'File processed successfully', 'processed_image': IMG_PATH})

    return jsonify({'error': 'Invalid file type'})

@app.route('/adjust', methods=['POST'])
def adjust():
    data = request.get_json()
    brightness = data['brightness']
    contrast = data['contrast']
    hue = data['hue']
    saturation = data['sat']
    sharpness = data['sharp']
    
    img = adjust_brightness("static/"+IMG_PATH, brightness)
    img = adjust_contrast(img, contrast)
    img = adjust_hue(img, hue)
    img = adjust_saturation(img, saturation)
    img = adjust_sharpness(img, sharpness)
    
    cv2.imwrite("static/processed/processed2.jpg", img)
    return jsonify({'message': 'File processed successfully', 'processed_image': "processed/processed2.jpg"})
    

if __name__ == '__main__':
    app.run(debug=True)
