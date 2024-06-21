const fs = require('fs');

async function preprocessData() {
    const rawData = fs.readFileSync('src/yield_data.json');
    const { pools } = JSON.parse(rawData);

    const totalValueLocked = pools.map(pool => parseFloat(pool.totalValueLockedUSD));
    const volumeUSD = pools.map(pool => parseFloat(pool.volumeUSD));
    const feesUSD = pools.map(pool => parseFloat(pool.feesUSD));

    // Normalize data
    const minMaxNormalize = (data) => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        return data.map(value => (value - min) / (max - min));
    };

    const normalizedData = {
        pools: pools.map(pool => pool.id),
        totalValueLocked: minMaxNormalize(totalValueLocked),
        volumeUSD: minMaxNormalize(volumeUSD),
        feesUSD: minMaxNormalize(feesUSD)
    };

    fs.writeFileSync('src/normalized_yield_data.json', JSON.stringify(normalizedData));
    console.log('Data preprocessing complete.');
}

preprocessData();
