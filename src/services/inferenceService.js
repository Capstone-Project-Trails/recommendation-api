const tf = require('@tensorflow/tfjs-node');

const inferenceService = async (model, input) => {
    try {
        const tensorInput = tf.tensor2d([input]);
        const prediction = model.predict(tensorInput);
        return prediction.dataSync()[0];
    } catch (error) {
        throw new Error('Gagal melakukan inferensi');
    }
};

module.exports = inferenceService;
