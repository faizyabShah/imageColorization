
import matplotlib.pyplot as plt
from colorizers import *
import cv2
from skimage.color import rgb2lab, lab2rgb
import numpy as np
from keras.preprocessing.image import img_to_array, load_img
import matplotlib.pyplot as plt
from skimage.transform import resize



def predict(filename, model):
    img1_color=[]
    img1 = filename
    img1 = resize(img1 ,(128,128))
    img1_color.append(img1)
    img1_color = np.array(img1_color, dtype=float)
    img1_color = rgb2lab(1.0/255*img1_color)[:,:,:,0]
    img1_color = img1_color.reshape(img1_color.shape+(1,))
        
    output1 = model.predict(img1_color)
    output1 = output1*128
    result = np.zeros((128, 128, 3))
    result[:,:,0] = img1_color[0][:,:,0]
    result[:,:,1:] = output1[0]
    img2 = lab2rgb(result)
    return img2

def crop_image(filePath):
    img = cv2.imread(filePath)
    width, height, _ = img.shape
    
    width = max(width, height)
    
    # crop image
    img = img[0:width, 0:width]
    
    return img

def process_file(filePath, modelstr, modelval=None):
    # try:
        if modelstr == 'model1':
            colorizer_siggraph17 = siggraph17(pretrained=True).eval()

            img = cv2.imread(filePath)
            img = img[:, :, [2, 1, 0]] #conversion to RGB
            (tens_l_orig, tens_l_rs) = preprocess_img(img, HW=(256,256))

            out_img_siggraph17 = postprocess_tens(tens_l_orig, colorizer_siggraph17(tens_l_rs).cpu())
            
            plt.imsave('static/processed/processed.jpg', out_img_siggraph17)
            
        elif modelstr == 'model2':
            
            img = crop_image(filePath)
            print("HELLO")
            prediction = predict(img, modelval)
            # scale upto 255
            prediction = prediction * 255
            cv2.imwrite('static/processed/processed.jpg', prediction)
            
            
        return True

    # except Exception as e:
    #     print(e)
        # return False
