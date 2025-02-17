import React, { useState, useRef } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../functions/globalURL';
import EditedBlock from './EditedBlockProfile';
const ModalClosureMoney = ({ show, onHide, slug }) => {
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();

    const handleSubmit = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);

        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/projects/${slug}/close_money_collection/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },
            });
            onHide();
            // Закрываем модальное окно после успешного сохранения
        } catch (error) {
            console.error('Ошибка при отправке запроса на сервер:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label className="fs-3">
                                Закрыть сбор средств
                            </Form.Label>
                        </Form.Group>
                    </Form>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button
                            variant="primary"
                            type="danger"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            Закрыть сбор
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

export default ModalClosureMoney;
