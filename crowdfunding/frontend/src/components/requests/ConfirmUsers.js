import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import ConfirmModalUser from './ConfirmModalUsers';
import url from '../../globalURL';
const ConfirmUsers = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(
                url + '/profiles/not_confirmed_users/',
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
            <Table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Логин</th>
                        <th>Email</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Подтвердить юзера</th>
                    </tr>
                </thead>
                {data && (
                    <tbody>
                        {showModal && (
                            <ConfirmModalUser
                                show={true}
                                onHide={closeModal}
                                slug={modalValue}
                            />
                        )}
                        {data.user.map((request) => (
                            <tr>
                                <td>
                                    <img
                                        src={request.image}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                        }}
                                    />
                                </td>
                                <td>{request.username}</td>
                                <td>{request.email}</td>
                                <td>{request.first_name}</td>
                                <td>{request.last_name}</td>
                                <td>
                                    <Button
                                        onClick={handleClick}
                                        value={request.username}
                                    >
                                        Подтвердить юзера
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

export default ConfirmUsers;
