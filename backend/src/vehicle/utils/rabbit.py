import json

import pika

from vehicle.configs.rabbit_config import rabbit_settings


def send_user_registered(user_id: int, tg: str) -> None:
    params = pika.URLParameters(rabbit_settings.rabbitmq_url)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    
    channel.queue_declare(queue='user_registered', durable=True)

    message = {
        "user_id": user_id,
        "tg": tg
    }

    channel.basic_publish(
        exchange='',
        routing_key='user_registered',
        body=json.dumps(message).encode(),
        properties=pika.BasicProperties(delivery_mode=2)
    )

    connection.close()