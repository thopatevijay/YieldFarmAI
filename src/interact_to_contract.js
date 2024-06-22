require('dotenv').config();
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = `0xafC2318b00b2021BfDB59110bc64666Bcfc368fe`; // deployed to Sepolia
const abi = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

async function predictBestPool() {
    const model = await tf.loadLayersModel('file://./src/model/model.json');

    const rawData = fs.readFileSync('src/normalized_yield_data.json');
    const data = JSON.parse(rawData);
    
    // Prepare input tensor for prediction
    const inputs = tf.tensor2d([
        data.totalValueLocked,
        data.volumeUSD,
        data.feesUSD
    ]).transpose();

    // Make prediction using the loaded model
    const prediction = model.predict(inputs);
    const predictedValues = await prediction.data();
    const maxPrediction = Math.max(...predictedValues);
    const bestPoolIndex = predictedValues.indexOf(maxPrediction);
    const bestPoolId = data.pools[bestPoolIndex];

    console.log(`Predicted best pool ID: ${bestPoolId}`);

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        // Call the reallocate function on the smart contract
        const tx = await contract.reallocate(bestPoolId);
        await tx.wait();

        console.log('Reallocated funds to', bestPoolId);
    } catch (error) {
        console.error('Error reallocating funds:', error);
    }
}

predictBestPool();