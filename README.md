# Image Colorization Project

## Project Overview
This project explores the application of Digital Image Processing (DIP) techniques in the colorization of black and white images. The focus is on using advanced algorithms and methodologies to add color to monochrome images, enhancing their utility and aesthetic appeal. The process involves detailed pre-processing and post-processing stages, ensuring high-quality colorization while preserving the integrity of the original images.

## Abstract
This project contributes significantly to the fields of image processing, historical restoration, and media enhancement by developing an advanced colorization process that combines the latest techniques in deep learning and image processing.

## Data Acquisition
We leveraged the flowers dataset available on Kaggle, consisting of around 15,000 images of 16 different species of flowers. Approximately 5,000 images were used to train our model.

## Image Pre-Processing
Various preprocessing techniques were implemented using the OpenCV library to improve the input data for the subsequent prediction model. Key steps include:
- **Contrast Stretching**: Adjusting intensity values to maximize dynamic range.
- **Noise Detection and Removal**: Using median blur to eliminate noise while preserving image details.
- **Edge Enhancement**: Utilizing the Canny edge detection algorithm to emphasize edges.

## Methodology
### Data Loading and Preprocessing
Images were resized to 128x128 and converted from RGB to LAB format. The L bit represents luminosity, while the A and B bits represent color information.

### Model Selection
An encoder-decoder CNN architecture was chosen for its effectiveness in feature extraction and image reconstruction. The model was trained with the following hyperparameters:
- Learning rate: 0.003
- Batch size: 16
- Epochs: 30
- Optimizer: Adam
- Loss function: Mean-squared error

### Model Training
The model was trained on a dataset of 5,000 images, with checkpoints saved after each epoch to monitor performance.

### Model Evaluation
The model's effectiveness was tested on metrics such as training accuracy, validation accuracy, and loss function.

## Results and Analysis
The final test accuracy of the model was around 85%, with a training loss close to 0.04 MSE. Experiments with different hyperparameters were conducted to optimize performance.

