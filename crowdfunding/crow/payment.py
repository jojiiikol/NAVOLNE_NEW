import uuid

from crowdfunding.settings import yookassa_payment

def create_payment(value, user):
    idempotence_key = uuid.uuid4()
    payment = yookassa_payment.Payment.create({
        "amount": {
            "value": value,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:8000/projects/1"
        },
        "capture": True,
        "description": f"Пополнение баланса для пользователя: {user.username}"
    }, idempotence_key)
    return payment, idempotence_key
