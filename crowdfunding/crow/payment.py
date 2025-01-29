import uuid

from crowdfunding.settings import yookassa_payment

def create_payment():
    payment = yookassa_payment.Payment.create({
        "amount": {
            "value": "100",
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:8000/projects/1"
        },
        "capture": True,
        "description": "Тестовый заказ"
    }, uuid.uuid4())
    return payment