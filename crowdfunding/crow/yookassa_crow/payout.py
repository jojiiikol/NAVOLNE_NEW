from crowdfunding.settings import yookassa_payment
import uuid

from crow.utils import result_amount_with_commission


def create_payout(bank_card, project):
    idempotence_key = str(uuid.uuid4())
    value = result_amount_with_commission(project)
    payout = yookassa_payment.Payout.create({
        "amount": {
          "value": value,
          "currency": "RUB"
        },
        "payout_destination_data": {
            "type": "bank_card",
            "card": {
              "number": bank_card
          }
        },
        "description": f"Выплата по проекту {project.name}"
    }, idempotence_key)
    return payout, idempotence_key