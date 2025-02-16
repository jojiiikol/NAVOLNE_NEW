import React, { useState, useRef } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';
import { WindowSidebar } from 'react-bootstrap-icons';

const MoneyAdd = ({ show, onHide, totalmoney }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [money, setMoney] = useState();
    const [flag, setFlag] = useState();
    const [formShow, setFormShow] = useState(false);
    useEffect(() => {
        setIsLoading(true);
    }, []);

    const handleSubmit = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        formDataObject.append('amount', money);
        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/profiles/replenishment/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },

                body: formDataObject,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.data.confirmation.confirmation_url);
                    if (data.data.confirmation.confirmation_url)
                        window.location.href =
                            data.data.confirmation.confirmation_url;
                });
            onHide();
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при отправке запроса на сервер:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setMoney(event.target.value);
        if (event.target.value > 10) {
            setIsLoading(false);
        }
        if (event.target.value < 10) {
            setIsLoading(true);
        }
        if (event.target.value > 350000) {
            setIsLoading(true);
        }
    };
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Label className="fs-2 fw-bold">
                            Внести деньги
                        </Form.Label>

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
                                placeholder="Введите сумму не более 350000 руб."
                            />
                        </Form.Group>
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

export default MoneyAdd;
