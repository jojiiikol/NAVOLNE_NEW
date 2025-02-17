import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Image,
    Button,
    ListGroup,
    ListGroupItem,
    Badge,
    CardHeader,
    Card,
    CardBody,
    Row,
    Col,
} from 'react-bootstrap';
import EditProfileModal from '../components/forms/EditProfileModal';
import MyCard from '../components/cards/MiniProjectCard';
import url from '../components/functions/globalURL';

const AdminComponent = () => {
    // useEffect(() => {
    // 	if (!localStorage.getItem('accessToken')) {
    // 		window.location.href = `/login`; }
    // }, []);
    const { profilename } = useParams();
    const [data, setData] = useState(null);

    const [isCleared, setIsCleared] = useState(false);

    const clearLocalStorage = () => {
        if (!isCleared) {
            localStorage.clear();
            setIsCleared(true);
            window.location.href = `/home`;
        }
    };
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна
    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (localStorage.getItem('accessToken')) {
                const response = await fetch(
                    url + '/profiles/' + profilename + '/',
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
            }
            if (!localStorage.getItem('accessToken')) {
                const response = await fetch(
                    url + '/profiles/' + profilename + '/',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setData(data);
            }
        };
        fetchData();
    }, [profilename]);

    return (
        <Container style={{ marginTop: '80px' }}>
            {data && (
                <div>
                    <h1 className="d-flex justify-content-center">
                        Админ панель
                    </h1>
                    <Row>
                        {data.is_admin && (
                            <div>
                                <div className="d-flex justify-content-between mt-2">
                                    <Button
                                        variant="primary"
                                        href="/project_change_requests/"
                                    >
                                        Просмотреть заявки на изменения проекта
                                    </Button>
                                    <Button
                                        variant="primary"
                                        href="/project_closure_requests/"
                                    >
                                        Просмотреть заявки на закрытие сбора
                                    </Button>
                                    <Button
                                        variant="primary"
                                        href="/not_confirmed_projects/"
                                    >
                                        Показать неподтвержденные проекты
                                    </Button>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <Button
                                        variant="primary"
                                        href="/profile_change_requests/"
                                    >
                                        Просмотреть заявки на изменения профиля
                                    </Button>
                                    <Button
                                        variant="primary"
                                        href="/not_confirmed_users/"
                                    >
                                        Показать неподтвержденных юзеров
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default AdminComponent;
