# YieldFarmAI

YieldFarmAI is a sophisticated decentralized application (dApp) that leverages artificial intelligence to optimize yield farming strategies across various decentralized finance (DeFi) protocols. The platform integrates machine learning models to predict the most profitable yield farming pools based on real-time data analysis of factors such as total value locked, trading volume, and transaction fees.

## Key Features

- **Data Fetching and Preprocessing:** Automated data retrieval from DeFi platforms like Uniswap using APIs, followed by data preprocessing to standardize and normalize for accurate model training.

- **Machine Learning Model Training:** Utilizes TensorFlow.js to train predictive models that analyze historical yield farming data and identify patterns indicative of optimal investment opportunities.

- **Smart Contract Integration:** Seamlessly interacts with Ethereum-based smart contracts to automate fund allocation into the predicted best-performing yield farming pools.

- **User Benefits:** Enables users to maximize returns on their investments by dynamically reallocating funds based on AI-driven predictions, enhancing efficiency and profitability in yield farming strategies.

YieldFarmAI empowers decentralized finance participants with cutting-edge AI technology, providing insights and strategies to navigate the complex DeFi landscape effectively.

## Technical Stack

- **Backend:** Node.js (for server-side scripting)
- **Machine Learning:** TensorFlow.js (for model training and prediction)
- **Blockchain:** Ethereum (for smart contract deployment and interaction)
- **APIs:** GraphQL (for data fetching from DeFi platforms)
- **Data Processing:** JavaScript (for data preprocessing)

### To start project:

```shell

git clone https://github.com/thopatevijay/YieldFarmAI.git

cd YieldFarmAI

npm install

# step 1 : Run the script to fetch yield farming data from Uniswap:
node fetch_yeild_farming_data.js

# step 2 : Run the script to preprocess the fetched yield data:
node preprocess_yield_data.js

# step 3 : Run the script to train the model based on the preprocessed data:
node train_yield_model.js

# step 4 : Run the script to predict the best yield farming pool:
node predict_best_pool.js.

# step 5 : Run the script to interact with contract
node interact_to_contract.js


#### Deployed contract address

[0xafc2318b00b2021bfdb59110bc64666bcfc368fe](https://sepolia.explorer.mode.network/address/0xafc2318b00b2021bfdb59110bc64666bcfc368fe)