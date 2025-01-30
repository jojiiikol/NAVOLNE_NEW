import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import ProfileModalRequest from './ProfileModalRequest';
import url from '../../globalURL';
const ProfileChangeRequests = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(url + '/profile_change_requests/', {
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
        setModalValue(value); // Устанавливаем значение для вывода в модальном окне
        setShowModal(true); // Открываем модальное окно
    };
    return (
        <Container style={{ marginTop: '80px' }}>
            <Table>
                <thead>
                    <tr>
                        <th>Дата создания</th>
                        <th>Логин</th>
                        <th>Просмотреть заявку</th>
                    </tr>
                </thead>
                {data && (
                    <tbody>
                        {showModal && (
                            <ProfileModalRequest
                                show={true}
                                onHide={closeModal}
                                id={modalValue}
                            />
                        )}
                        {data.map((request) => (
                            <tr>
                                <td>{request.create_date}</td>
                                <td>{request.user.username}</td>
                                <td>
                                    <Button
                                        onClick={handleClick}
                                        value={request.pk}
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

export default ProfileChangeRequests;
