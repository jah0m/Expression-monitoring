from unittest import result
from xml.etree.ElementPath import prepare_descendant
from flask import Flask, Response, request      
import json   
import base64
from urllib.parse import unquote
import numpy as np
import pandas as pd
from matplotlib import pyplot
import tensorflow as tf
from tensorflow.keras import optimizers
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import load_img, img_to_array 
              
app = Flask(__name__)

def getExpr(img_b64):
    img_data = base64.b64decode(img_b64)
    fh = open("imageToSave.png", "wb")
    fh.write(img_data)
    fh.close()
    img = load_img("imageToSave.png", color_mode='grayscale', target_size=(48, 48),interpolation='nearest', keep_aspect_ratio=True)
    px = img_to_array(img)
    px = px.reshape(1, 48, 48, 1).astype('float32')
    px = px / 255
    predict_x=model.predict(px) 
    labels = ['happy', 'sad', 'neutral']
    result = predict_x[0].tolist()
    result_json = {
        'happy': result[0],
        'sad': result[1],
        'neutral': result[2]
    }
    return json.dumps(result_json)

@app.route('/', methods=['GET'])
def index():
    resp = Response("Foo bar baz")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/predict', methods=['POST'])
def pred():
    img_b64 = unquote(request.args.get('base64', type = str))
    resp = Response(getExpr(img_b64))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp  
    

if __name__ == "__main__":
    print('loading model')
    # load model
    model = tf.keras.models.load_model("model.h5")
    model.compile(loss='binary_crossentropy',
                  optimizer='rmsprop',
                  metrics=['accuracy'])
    print('model loaded')
    app.run() 