import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';

const EditProjectModal = ({ show, onHide, slug }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState(null);
    const [category2, setCategory] = useState([]);

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(url + '/additional/', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setData(data.category);
        };
        fetchData();
    }, []);
    const handleFileChange = (event) => {
        // Получаем все файлы из input
        const newFiles = Array.from(event.target.files);
        setFiles(newFiles);
    };
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    // Состояние для хранения массива объектов
    const [images, setImages] = useState([]);

    // Функция для преобразования массива файлов в массив объектов
    const createImageObjects = (files) => {
        return files.map((file) => ({ image: file }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formDataObject = new FormData();
        if (files) {
            const imageObjects = createImageObjects(files);
            setImages(imageObjects);
            console.log(imageObjects);
            imageObjects.forEach((image, index) => {
                formDataObject.append(
                    `add_image[${index}]image`,
                    event.target.image2.files[index]
                );
            });
            // console.log(result);
        }
        Object.keys(formData).forEach((key) => {
            if (key == 'image') {
                formDataObject.append(key, event.target.image.files[0]);
                console.log(event.target.image.files[0]);
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
        for (var pair of formDataObject.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        const accessToken = localStorage.getItem('accessToken');
        try {
            await fetch(url + `/projects/${slug}/change_request/`, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                body: formDataObject,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
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
    // const handleChangePhotos = (e) => {
    //     const add_images = add_images2;
    //     add_images.push(e.target.files[0]);
    //     setImages(add_images);
    //     if (category2.length !== 0) {
    //         setFormData({ ...formData, add_image: add_images2 });
    //     }
    //     console.log(add_images2);
    // };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование проекта</Modal.Title>
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

                    <Form.Group className="mb-2">
                        <Form.Label>Фотографии на шапку:</Form.Label>
                        <Form.Control
                            multiple
                            accept="image/jpeg,image/png,image/gif"
                            name="image2"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <div style={{ display: 'block' }}>
                            <Form.Text className="text-muted">
                                *вы можете выбрать несколько файлов
                            </Form.Text>
                        </div>
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
