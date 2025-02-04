from crow.utils import result_amount_with_commission
import uuid
import yookassa
from yookassa.domain.models.currency import Currency

from crowdfunding.settings import PAYOUT_AGENT_ID, PAYOUT_SECRET_KEY

yookassa_payout = yookassa
yookassa_payout.Configuration.account_id = PAYOUT_AGENT_ID
yookassa_payout.Configuration.secret_key = PAYOUT_SECRET_KEY

def create_payout(bank_card, project):
    idempotence_key = str(uuid.uuid4())
    value = result_amount_with_commission(project)
    print(value)
    payout = yookassa.Payout.create({
        "amount": {
          "value": 700,
          "currency": Currency.RUB
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