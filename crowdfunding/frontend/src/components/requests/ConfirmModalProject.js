import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import url from '../functions/globalURL';

const ConfirmModalProject = ({ show, onHide, slug }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();
    useEffect(() => {
        setFormData({ ...formData, confirmed: false });
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        //console.log(event.target.name, ':', event.target.value);
    };
    const handleChangeConfirmed = (e) => {
        if (e.target.checked) {
            setFormData({ ...formData, confirmed: true });
        } else {
            setFormData({ ...formData, confirmed: false });
        }
    };
    const { current: myArray } = useRef(['one', 'two', 'three']);

    const handleSubmit = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObject.append(key, formData[key]);
            console.log(key, ':', formData[key]);
        });
        //formDataObject.append('username', 'govno');
        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/projects/${slug}/confirm_project/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },

                body: formDataObject,
            });
            window.location.reload();
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
                                Ответ по проекту
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="answer"
                                value={formData.answer || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Check
                                type="checkbox"
                                value={true}
                                name={'confirmed'}
                                onChange={handleChangeConfirmed}
                                label={'confirmed'}
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
                            Сохранить
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

export default ConfirmModalProject;
