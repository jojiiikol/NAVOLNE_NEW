import React, { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import url from '../../globalURL';

const ModalShowClosure = ({ show, onHide, slug, id }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const handleChangeConfirmed = (e) => {
        if (e.target.checked) {
            setFormData({ ...formData, allowed: true });
        } else {
            setFormData({ ...formData, allowed: false });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObject.append(key, formData[key]);
            console.log(key, ':', formData[key]);
        });

        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/project_closure_requests/${id}/answer/`, {
                method: 'PUT',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },

                body: formDataObject,
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
                        <Form.Label className="fs-5">
                            <a className="fs-5" href={`/projects/${slug}`}>
                                Ссылка на проект
                            </a>
                        </Form.Label>
                        <Form.Group className="mb-2">
                            <Form.Label className="fs-3">
                                Ответ по проекту
                            </Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Check
                                type="checkbox"
                                value={true}
                                name={'allowed'}
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

export default ModalShowClosure;
