const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const loadModel = async () => {
    const modelPath = path.resolve(__dirname, '../../models/my_model.json');
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    return model;
};

module.exports = loadModel;