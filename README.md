# Sound.AI
Building an AI-IoT system to monitor product quality and process audio data using artificial intelligence.

# Data workflow
![image](https://github.com/Sherly1001/sound.ai/assets/50266222/cf1fd96c-b031-41bf-b8d6-bdeea598c912)

# How to run?
First, ensure that the database and MQTT broker service are running. Alternatively, you can start them using Docker:
```sh
cd docker
docker-compose up -d db mqtt
```

Start the backend service:
```sh
cd backend
yarn install
yarn start:dev
```

Start the AI module:
```sh
cd ai
pip install -r requirements.txt
python main.py
```

Run the frontend:
```sh
cd frontend
yarn install
yarn dev
```

Or run all modules in Docker:
```sh
cd docker
docker-compose up -d
```
