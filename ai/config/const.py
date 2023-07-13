import os
import dotenv

dotenv.load_dotenv()

mqtt = {
    'brocker': os.environ.get('MQTT_HOST') or 'localhost',
    'port': int(os.environ.get('MQTT_PORT') or 1883),
    'username': os.environ.get('MQTT_USERNAME') or None,
    'password': os.environ.get('MQTT_PASSWORD') or None,
}

api = {
    'url': os.environ.get('API_URL') or 'http://localhost:3000',
}
