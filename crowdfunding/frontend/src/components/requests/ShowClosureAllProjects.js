import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import ConfirmModalProject from './ConfirmModalProject';

import url from '../../globalURL';
import ModalShowClosure from './ModalShowClosure';
const ShowClosureAllProjects = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [modalSlug, setModalSlug] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(url + '/project_closure_requests/', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
            });
            const data = await response.json();
            setData(data);
            console.log(data);
        };
        fetchData();
    }, []);

    const handleClick = (e) => {
        // Получаем значение из атрибута value кнопки
        const value = e.target.value;
        const name = e.target.name;
        setModalValue(value); // Устанавливаем значение для вывода в модальном окне
        setModalSlug(name);
        setShowModal(true); // Открываем модальное окно
    };
    return (
        <Container style={{ marginTop: '80px' }}>
            <Table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>closure_type</th>
                        <th>Просмотреть заявку</th>
                    </tr>
                </thead>
                {data && (
                    <tbody>
                        {showModal && (
                            <ModalShowClosure
                                show={true}
                                onHide={closeModal}
                                id={modalValue}
                                slug={modalSlug}
                            />
                        )}
                        {data.map((request) => (
                            <tr>
                                <td>{request.project.name}</td>
                                <td>{request.project.closure_type}</td>
                                <td>
                                    <Button
                                        onClick={handleClick}
                                        value={request.project.pk}
                                        name={request.project.slug}
                                    >
                                        Просмотреть заявку
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </Table>
        </Container>
    );
};

export default ShowClosureAllProjects;
