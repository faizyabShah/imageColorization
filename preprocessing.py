import cv2
import numpy as np


def analyze_and_remove_noise(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    cp_img = img.copy()
    
    noise_ratio = 0.02
    salt_and_pepper = np.random.rand(img.shape[0], img.shape[1])
    img[salt_and_pepper < noise_ratio / 2] = 0
    img[salt_and_pepper > 1 - noise_ratio / 2] = 255

    denoised_img = cv2.medianBlur(img, 5)

    diff_img = cv2.absdiff(img, denoised_img)
    noise_percentage = np.sum(diff_img > 0) / (img.shape[0] * img.shape[1]) * 100

    if noise_percentage > 70:
        return denoised_img
    return cp_img


def contrast_stretching(img, min_percentile=1, max_percentile=99):
    intensity_range = np.max(img) - np.min(img)
    threshold = 150
    cv2.imwrite("te.jpg", img)
    print(intensity_range)
    if intensity_range > threshold:
        return img
    
    min_intensity = np.percentile(img, min_percentile)
    max_intensity = np.percentile(img, max_percentile)

    stretched_img = np.clip((img - min_intensity) / (max_intensity - min_intensity) * 255, 0, 255).astype(np.uint8)
    return stretched_img


def edge_detection_enhancement(image):

    blurred_image = cv2.GaussianBlur(image, (3, 3), 0)
    edges = cv2.Canny(blurred_image, threshold1=200, threshold2=200)  # Adjust these thresholds as needed
    kernel = np.ones((1,1), np.uint8)  # A smaller kernel than before
    dilated_edges = cv2.dilate(edges, kernel, iterations=1)  # Fewer iterations
    inverted_edges = cv2.bitwise_not(dilated_edges)
    image_with_enhanced_edges = cv2.bitwise_and(image, image, mask=inverted_edges)
    
    return image_with_enhanced_edges


def preprocess(filePath):
    
    img = analyze_and_remove_noise(filePath)
    img = edge_detection_enhancement(img)
    img = contrast_stretching(img, 1, 99)
    cv2.imwrite("static/processed/processed.jpg", img)
    cv2.imwrite("uploads/temp.jpg", img)