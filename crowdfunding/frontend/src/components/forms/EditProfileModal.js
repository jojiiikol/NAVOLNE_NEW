import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../functions/globalURL';

const EditProfileModal = ({ show, onHide, username, profile }) => {
    const [formData, setFormData] = useState({
        last_name: profile.last_name,
        first_name: profile.first_name,
        about: profile.about,
        birthday: profile.birthday,
        company: profile.company,
    }); // Состояние данных формы
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
            console.log(data.skills);
            let defaultSkills = new Set();
            data.skills.forEach((item) => {
                if (profile.skill.length != 0) {
                    profile.skill.forEach((item2) => {
                        if (item2 == item.name) {
                            defaultSkills.add(item.id);
                        }
                    });
                }
            });
            const uniqueDefaultSkills = Array.from(defaultSkills);

            setSkills(uniqueDefaultSkills);
            console.log(skills2);
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
            } else {
                formDataObject.append(key, formData[key]);
                console.log(key, ':', formData[key]);
            }
        });
        const accessToken = localStorage.getItem('accessToken');
        if (formDataObject.entries().next().value) {
            try {
                await fetch(url + `/profiles/${username}/change/`, {
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + accessToken,
                    },

                    body: formDataObject,
                });

                // Закрываем модальное окно после успешного сохранения
            } catch (error) {
                console.error('Ошибка при отправке запроса на сервер:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (skills2.length !== 0) {
            const formDataSkills = new FormData();
            skills2.forEach((cat) => formDataSkills.append('skill', cat));
            try {
                await fetch(url + `/profiles/${username}/`, {
                    method: 'PATCH',
                    headers: {
                        //'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + accessToken,
                    },

                    body: formDataSkills,
                });
            } catch (error) {
                console.error('Ошибка при отправке запроса на сервер:', error);
            }
        }
        //formDataObject.append('username', 'govno');
        alert('Модератор рассмотрит вашу заявку');
        onHide();
        // window.location.href = `/profile/` + username;
    };

    const handleChangeSkills = (e) => {
        const skillId = Number(e.target.name);
        const updatedSkills = e.target.checked
            ? [...skills2, skillId]
            : skills2.filter((id) => id !== skillId);
        setSkills(updatedSkills);
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
                            defaultValue={profile.last_name}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите навыки</Form.Label>
                        {data ? (
                            data.map((cat) => (
                                <div key={cat.id}>
                                    <Form.Check
                                        type="checkbox"
                                        name={cat.id}
                                        onChange={handleChangeSkills}
                                        label={cat.name}
                                        checked={skills2.includes(cat.id)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div>Загрузка навыков...</div>
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
