const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

async function predictBestPool() {
    const model = await tf.loadLayersModel('file://./src/model/model.json');

    const rawData = fs.readFileSync('src/normalized_yield_data.json');
    const data = JSON.parse(rawData);

    const inputs = tf.tensor2d([
        data.totalValueLocked,
        data.volumeUSD,
        data.feesUSD
    ]).transpose();

    const prediction = model.predict(inputs);
    const predictedValues = await prediction.data();

    const maxPrediction = Math.max(...predictedValues);
    const bestPoolIndex = predictedValues.indexOf(maxPrediction);
    const bestPoolId = data.pools[bestPoolIndex];

    console.log(`Predicted best pool ID: ${bestPoolId}`);
}

predictBestPool();
