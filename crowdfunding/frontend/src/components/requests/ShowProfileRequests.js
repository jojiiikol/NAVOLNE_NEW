import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import ModalProfileShowRequest from './ShowModalProfileRequests';
import url from '../../globalURL';
const ShowProfileRequests = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(
                url + '/profile_change_requests/show_requests/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            const data = await response.json();
            const newData = data.map((item) => ({
                ...item,
                status: 'На рассмотрении',
                button: '',
            }));
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].answer_request.length > 0) {
                    let status = newData[i].answer_request.pop();

                    let confirmed = status.confirmed;
                    console.log(confirmed);
                    if (confirmed) {
                        newData[i].status = 'Подтверждено';
                        newData[i].button = true;
                    } else {
                        newData[i].status = 'Отклонено';
                        newData[i].button = true;
                    }
                }
            }
            setData(newData);
            console.log(newData);
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
                        <th>Статус</th>
                        <th>Просмотреть ответ</th>
                    </tr>
                </thead>
                {data && (
                    <tbody>
                        {showModal && (
                            <ModalProfileShowRequest
                                show={true}
                                onHide={closeModal}
                                id={modalValue}
                            />
                        )}
                        {data.map((request) => (
                            <tr>
                                <td>{request.create_date}</td>
                                <td>{request.status}</td>
                                <td>
                                    {request.button && (
                                        <Button
                                            onClick={handleClick}
                                            value={request.pk}
                                        >
                                            Просмотреть ответ
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </Table>
        </Container>
    );
};

export default ShowProfileRequests;
