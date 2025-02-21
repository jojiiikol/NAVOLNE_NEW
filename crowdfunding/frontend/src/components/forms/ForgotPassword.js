import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../functions/globalURL';

const ForgotPasswordModal = ({ show, onHide }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [email, setEmail] = useState('');
    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit2 = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();

        fetch(url + '/profiles/get_message_reset_password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });

        // Закрываем модальное окно после успешного сохранения

        //console.error('Ошибка при отправке запроса на сервер:', error);

        alert('Проверьте почту');
        //  onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Восстановление пароля</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit2}>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Ваша почта"
                        />
                    </Form.Group>

                    <Modal.Footer className="">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            Отправить
                        </Button>
                        <Button variant="secondary" onClick={onHide}>
                            Отменить
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ForgotPasswordModal;
