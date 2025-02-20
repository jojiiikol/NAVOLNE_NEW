import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Table,
    Modal,
    ButtonGroup,
    ToggleButton,
} from 'react-bootstrap';
import ProjectModalRequest from './ProjectModalRequest';
import url from '../functions/globalURL';
const ProjectChangeRequests = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const [modalValue, setModalValue] = useState('');
    const [data, setData] = useState(null);
    const [showMode, setShowMode] = useState('without'); // По умолчанию показываем форму авторизации
    const [withData, setWithData] = useState(null);
    const [withoutData, setWithoutData] = useState(null);
    const handleToggle = (newMode) => {
        console.log(withoutData);

        setShowMode(newMode); // Используем коллбэк для обновления состояния

        if (showMode === 'without') {
            setData(withData);
        } else if (showMode === 'with') {
            setData(withoutData);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(
                url + '/project_change_requests/requests_without_answer/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            const data = await response.json();
            setData(data);
            setWithoutData(data);
            console.log(data);
        };
        fetchData();

        const fetchData2 = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(
                url + '/project_change_requests/requests_with_answer/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            const data = await response.json();

            setWithData(data);
            console.log(data);
        };
        fetchData2();
    }, []);

    const handleClick = (e) => {
        // Получаем значение из атрибута value кнопки
        const value = e.target.value;
        setModalValue(value); // Устанавливаем значение для вывода в модальном окне
        setShowModal(true); // Открываем модальное окно
    };
    return (
        <Container style={{ marginTop: '80px' }}>
            <ButtonGroup toggle>
                <ToggleButton
                    type="radio"
                    name="auth-mode"
                    value="without"
                    variant="outline-primary"
                    checked={showMode == 'without'}
                    onClick={() => handleToggle('without')}
                    className="fw-bold fs-4"
                    style={{ height: '3rem' }}
                >
                    БЕЗ ОТВЕТОВ
                </ToggleButton>
                <ToggleButton
                    type="radio"
                    name="auth-mode"
                    value="with"
                    variant="outline-primary"
                    checked={showMode == 'with'}
                    className="fw-bold fs-4"
                    style={{ height: '3rem' }}
                    onClick={() => handleToggle('with')}
                >
                    ПРОСМОТРЕННЫЕ
                </ToggleButton>
            </ButtonGroup>
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
                            <ProjectModalRequest
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

export default ProjectChangeRequests;
