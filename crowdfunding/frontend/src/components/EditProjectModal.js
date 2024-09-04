import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';

const EditProjectModal = ({ show, onHide, slug }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState(null);
    const [category2, setCategory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8000/additional/', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setData(data.category);
            console.log(data.category);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key == 'image') {
                formDataObject.append(key, event.target.image.files[0]);
            } else if (key == 'category') {
                if (category2.length !== 0) {
                    category2.forEach((cat) =>
                        formDataObject.append('category', cat)
                    );
                }
            } else {
                formDataObject.append(key, formData[key]);
            }
        });

        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(`http://localhost:8000/projects/info/${slug}`, {
                method: 'PATCH',
                headers: {
                    //'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                body: formDataObject,
            });
            onHide();
        } catch (error) {
            console.error('Ошибка при отправке запроса на сервер:', error);
        } finally {
            setIsLoading(false);
        }

        //window.location.href = `/projects/`+slug;
    };

    const handleChangeCategory = (e) => {
        const category = category2;
        let index;
        if (e.target.checked) {
            category.push(Number(e.target.name));
        } else {
            index = category.indexOf(Number(e.target.name));
            category.splice(index, 1);
        }
        setCategory(category);
        if (category2.length !== 0) {
            setFormData({ ...formData, category: category2 });
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
                        <Form.Label>Название проекта</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Название вашего проекта"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Короткое описание</Form.Label>
                        <Form.Control
                            type="text"
                            name="small_description"
                            value={formData.small_description || ''}
                            onChange={handleChange}
                            placeholder="Представление для карточки проекта"
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Полное описание проекта"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите категории</Form.Label>
                        {data === null ? (
                            <div> No data for collection </div>
                        ) : (
                            data.map((cat) => (
                                <div key={cat.id}>
                                    <Form.Check
                                        type="checkbox"
                                        name={cat.id}
                                        onChange={handleChangeCategory}
                                        label={cat.name}
                                    />
                                </div>
                            ))
                        )}
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Фотография вашего проекта</Form.Label>
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

export default EditProjectModal;
