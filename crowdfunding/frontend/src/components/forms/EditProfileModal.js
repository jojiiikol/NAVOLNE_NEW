import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';

const EditProfileModal = ({ show, onHide, username }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState(null);
    const [skills2, setSkills] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(url + '/additional/', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setData(data.skills);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        //formData.username = localStorage.getItem('user');
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key == 'image') {
                formDataObject.append(key, event.target.image.files[0]);
            } else if (key == 'skills') {
                if (skills2.length !== 0) {
                    skills2.forEach((cat) =>
                        formDataObject.append('skill', cat)
                    );
                }
            } else {
                formDataObject.append(key, formData[key]);
                console.log(key, ':', formData[key]);
            }
        });
        //formDataObject.append('username', 'govno');
        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/profiles/${username}/change/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + accessToken,
                },

                body: formDataObject,
            });
            alert('Модератор рассмотрит вашу заявку');
            onHide();
            // Закрываем модальное окно после успешного сохранения
        } catch (error) {
            console.error('Ошибка при отправке запроса на сервер:', error);
        } finally {
            setIsLoading(false);
        }

        // window.location.href = `/profile/` + username;
    };

    const handleChangeSkills = (e) => {
        const skills = skills2;
        let index;
        if (e.target.checked) {
            skills.push(Number(e.target.name));
        } else {
            index = skills.indexOf(Number(e.target.name));
            skills.splice(index, 1);
        }
        setSkills(skills);
        if (skills2.length !== 0) {
            setFormData({ ...formData, skills: skills2 });
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование профиля</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleChange}
                            placeholder="Ваша фамилия"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleChange}
                            placeholder="Ваше имя"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Обо мне</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="about"
                            value={formData.about || ''}
                            onChange={handleChange}
                            placeholder="Расскажите немного о себе"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>День рождения</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthday"
                            value={formData.birthday || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Место работы</Form.Label>
                        <Form.Control
                            type="text"
                            name="company"
                            value={formData.company || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-2">
                        <Form.Label>ЕГРЮЛ</Form.Label>
                        <Form.Control
                            type="text"
                            name="document"
                            value={formData.document || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Паспорт</Form.Label>
                        <Form.Control
                            type="number"
                            name="passport"
                            value={formData.passport || ''}
                            onChange={handleChange}
                        />
                    </Form.Group> */}

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите навыки</Form.Label>
                        {data === null ? (
                            <div> No data for collection </div>
                        ) : (
                            data.map((cat) => (
                                <div key={cat.id}>
                                    <Form.Check
                                        type="checkbox"
                                        name={cat.id}
                                        onChange={handleChangeSkills}
                                        label={cat.name}
                                    />
                                </div>
                            ))
                        )}
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Ваша фотография</Form.Label>
                        <Form.Control
                            accept="image/jpeg,image/png,image/gif"
                            name="image"
                            type="file"
                            value={formData.image || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Modal.Footer className="">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            Сохранить
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

export default EditProfileModal;
