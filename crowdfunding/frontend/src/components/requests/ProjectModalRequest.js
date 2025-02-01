import React, { useState, useRef } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';
import EditedBlock from './EditedBlockProfile';
const ProjectModalRequest = ({ show, onHide, id }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();
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
    useEffect(() => {
        if (!id) return; // Проверяем, существует ли id, прежде чем делать запрос
        const fetchData = async () => {
            try {
                setIsLoading(true); // Включаем индикатор загрузки
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(
                    url + `/project_change_requests/${id}/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + accessToken,
                        },
                    }
                );
                const fetchedData = await response.json();
                setData(fetchedData);
                console.log(fetchedData);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            } finally {
                setIsLoading(false); // Выключаем индикатор загрузки
            }
        };

        fetchData();
    }, [id]); // Запускаем эффект только при изменении id
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
            await fetch(url + `/project_change_requests/${data.pk}/`, {
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
            {' '}
            {data && (
                <Modal show={show} onHide={onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Просмотр заявки</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-4">
                                <a href={`/projects/${data.slug}`}>
                                    Ссылка на проект
                                </a>
                            </Form.Group>
                            <Form.Group className="">
                                <Form.Label className="fs-3">
                                    Измененные данные:
                                </Form.Label>
                            </Form.Group>
                            <EditedBlock
                                name={'Description'}
                                data={data.description}
                            />
                            <EditedBlock
                                name={'end_date'}
                                data={data.end_date}
                            />
                            <EditedBlock name={'name'} data={data.name} />
                            <EditedBlock
                                name={'need_money'}
                                data={data.need_money}
                            />
                            <EditedBlock
                                name={'small_description'}
                                data={data.small_description}
                            />

                            {data.image && (
                                <div>
                                    <div>Image</div>
                                    <img
                                        src={data.image}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                        }}
                                    />
                                </div>
                            )}
                            {data.add_image && (
                                <div>
                                    <div>add_image</div>
                                    <img
                                        src={data.add_image.image}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                        }}
                                    />
                                </div>
                            )}
                        </Form>

                        <Modal.Footer className="mt-4"></Modal.Footer>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label className="fs-3">
                                    Ответ на изменения
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="answer_description"
                                    value={formData.answer_description || ''}
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
            )}
        </div>
    );
};

export default ProjectModalRequest;
