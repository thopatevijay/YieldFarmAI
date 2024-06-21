const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

async function trainModel() {
    const rawData = fs.readFileSync('src/normalized_yield_data.json');
    const data = JSON.parse(rawData);

    // Prepare the data
    const inputs = tf.tensor2d([
        data.totalValueLocked,
        data.volumeUSD,
        data.feesUSD
    ]).transpose();
    
    const labels = tf.tensor2d(data.feesUSD, [data.feesUSD.length, 1]);

    // Create a simple model
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 10, activation: 'relu', inputShape: [3]}));
    model.add(tf.layers.dense({units: 1}));

    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

    // Train the model
    await model.fit(inputs, labels, {
        epochs: 50,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch + 1}: loss = ${log.loss}`)
        }
    });

    await model.save('file://./src/model');
    console.log('Model trained and saved.');
}

trainModel();
