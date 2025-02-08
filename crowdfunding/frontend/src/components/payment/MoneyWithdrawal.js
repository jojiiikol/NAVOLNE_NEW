import React, { useState, useRef } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';

const MoneyWithdrawal = ({ show, onHide, totalmoney }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();
    const [money, setMoney] = useState();
    const [payout_token, setPayout_token] = useState();
    const [flag, setFlag] = useState();
    const [formShow, setFormShow] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        if (!window.PayoutsData) return;

        const payoutsData = new window.PayoutsData({
            type: 'payout',
            account_id: process.env.REACT_APP_AGENT_ID,
            success_callback: function (data) {
                console.log(data);
                setPayout_token(data.payout_token);
                setFormShow(true);
            },
            error_callback: function (error) {
                console.error(error);
            },
        });

        payoutsData.render('widget');
    }, []);

    const handleSubmit = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();

        formDataObject.append('payout_token', payout_token);
        formDataObject.append('amount', money);

        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/profiles/payout/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },

                body: formDataObject,
            });
            alert('Деньги скоро поступят на вашу карту.');
            onHide();
            // Закрываем модальное окно после успешного сохранения
        } catch (error) {
            console.error('Ошибка при отправке запроса на сервер:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setMoney(event.target.value);
        if (event.target.value > 500000) {
            setIsLoading(true);
            setFlag(1);
        }
        if (event.target.value > totalmoney) {
            setIsLoading(true);
            setFlag(2);
        }
        if (event.target.value < 5) {
            setIsLoading(true);
            setFlag(3);
        }
        if (
            event.target.value < totalmoney &&
            event.target.value < 500000 &&
            event.target.value > 5
        ) {
            setFlag(4);
            setMoney(event.target.value);
        }
        if (
            event.target.value < totalmoney &&
            event.target.value < 500000 &&
            event.target.value > 5 &&
            payout_token
        ) {
            console.log(payout_token);
            setMoney(event.target.value);
            setIsLoading(false);
            setFlag(5);
        }
    };
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Label className="fs-2 fw-bold">
                            Вывести деньги
                        </Form.Label>
                        <div id="widget"></div>
                        {formShow && (
                            <Form.Group className="">
                                <div className="d-flex fs-5 fw-bolder">
                                    <p>Ваш баланс: {totalmoney}</p>
                                </div>
                                <Form.Label className="fs-4">
                                    Введите сумму
                                </Form.Label>
                                <Form.Control
                                    name="amount"
                                    value={money || ''}
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Введите сумму"
                                />

                                {flag == 1 && (
                                    <div style={{ display: 'block' }}>
                                        <Form.Text className="text-danger">
                                            Сумма превышает 500000 руб.
                                        </Form.Text>
                                    </div>
                                )}
                                {flag == 2 && (
                                    <div style={{ display: 'block' }}>
                                        <Form.Text className="text-danger">
                                            Сумма превышает ваш баланс
                                        </Form.Text>
                                    </div>
                                )}
                                {flag == 3 && (
                                    <div style={{ display: 'block' }}>
                                        <Form.Text className="text-danger">
                                            Сумма меньше 5 руб.
                                        </Form.Text>
                                    </div>
                                )}
                                <div style={{ display: 'block' }}>
                                    <Form.Text className="text-muted">
                                        *Cумма для вывода не более 500000 руб.,
                                        не менее 5 руб. и не должна превышать
                                        ваш баланс
                                    </Form.Text>
                                </div>
                            </Form.Group>
                        )}

                        {flag == 5 && (
                            <Form.Text className="text-success fs-5">
                                Все данные введены верно, нажмите кнопку далее
                            </Form.Text>
                        )}
                    </Form>

                    <Modal.Footer className="">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            Далее
                        </Button>
                        <Button variant="secondary" onClick={onHide}>
                            Отменить
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MoneyWithdrawal;
