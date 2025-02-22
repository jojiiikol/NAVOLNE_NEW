import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import ProjectModalRequest from './ProjectModalRequest';
import url from '../functions/globalURL';
import MyCard from '../cards/MiniProjectCard';
const ExpiredProjects = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(
                url + '/projects/get_expired_projects/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            const data = await response.json();
            setData(data);
            console.log(data);
        };
        fetchData();
    }, []);

    const handleClick = (e) => {
        // Получаем значение из атрибута value кнопки
        const value = e.target.value;
        setModalValue(value); // Устанавливаем значение для вывода в модальном окне
        setShowModal(true); // Открываем модальное окно
    };
    return (
        <Container style={{ marginTop: '80px' }}>
            {data && (
                <Table>
                    <p className="d-flex justify-content-center fs-2 fw-bold">
                        Просроченные проекты
                    </p>
                    {data.length !== 0 &&
                        data.map((project) => (
                            <div className="mb-3">
                                {' '}
                                <MyCard
                                    className="mb-3"
                                    key={project.pk}
                                    slug={project.slug}
                                    name={project.name}
                                    small_description={
                                        project.small_description
                                    }
                                    image={project.image}
                                    confirmed="false"
                                />
                            </div>
                        ))}
                </Table>
            )}
        </Container>
    );
};

export default ExpiredProjects;
