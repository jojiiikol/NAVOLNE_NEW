import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Image,
    Button,
    ListGroup,
    ListGroupItem,
    Badge,
} from 'react-bootstrap';
import EditProfileModal from './EditProfileModal';

const ProfileComponent = () => {
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
                    'http://localhost:8000/profiles/' + profilename+'/',
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
                    'http://localhost:8000/profiles/' + profilename+'/',
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
                    <div className="d-flex">
                        <div>
                            <Image
                                style={{ width: '350px', objectFit: 'cover' }}
                                className="me-5"
                                src={data.image}
                                rounded
                            />
                            {data.skill.length !== 0 && (
                                <div className="d-flex ">
                                    {data.skill.map(
                                        (skill, index) => (
                                            <h5>
                                                <Badge
                                                    key={index}
                                                    className="ms-1 mt-1"
                                                >
                                                    {skill}
                                                </Badge>
                                            </h5>
                                        )
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-between me-5">
                                <p
                                    className="fs-5 fw-normal text-secondary mt-1"
                                    style={{ width: '300px' }}
                                >
                                    Поддержал проекты на сумму:{' '}
                                </p>
                                <p className="fs-5 fw-normal text-normal mt-1">
                                    {' '}
                                    {data.total_money_sent}
                                </p>
                            </div>
                            {data.is_owner && (
                                <div className="d-flex justify-content-between me-5">
                                    <p
                                        className="fs-5 fw-normal text-secondary "
                                        style={{ width: '300px' }}
                                    >
                                        Баланс:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal text-normal ">
                                        {' '}
                                        {data.money}
                                    </p>
                                </div>
                            )}

                            {data.is_owner && (
                                <div
                                    className="d-flex justify-content-between me-5"
                                    style={{}}
                                >
                                    <Button
                                        variant="danger"
                                        onClick={clearLocalStorage}
                                    >
                                        Выйти
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={openModal}
                                    >
                                        Редактировать
                                    </Button>
                                    {showModal && (
                                        <EditProfileModal
                                            show={true}
                                            onHide={closeModal}
                                            username={profilename}
                                            skills_base={data.skill}
                                        />
                                    )}
                                    <Button variant="primary" href="/create">
                                        Создать
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="fs-1 fw-bold mb-0">
                                {data.first_name}{' '}
                                {data.last_name}
                            </p>
                            <p className="fs-5 fw-normal text-secondary">
                                Автор присоединился {data.date_joined}
                            </p>
                            {data.about && (
                                <div>
                                    <p className="fs-5 fw-normal text-secondary">
                                        О себе:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ">
                                        {data.about}
                                    </p>
                                </div>
                            )}

                            {!data.about && (
                                <div>
                                    <p className="fs-5 fw-normal text-secondary">
                                        О себе:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal">
                                        пользователь любит анонимность, поэтому
                                        ничего о себе решил не рассказывать
                                    </p>
                                </div>
                            )}

                            {data.sex && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Пол:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        {data.sex}
                                    </p>
                                </div>
                            )}

                            {!data.sex && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Пол:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        всё сложно...
                                    </p>
                                </div>
                            )}

                            {data.groups.length !== 0 && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Группы:{' '}
                                    </p>
                                    {data.groups.map(
                                        (skill, index) => (
                                            <div
                                                className="badge bg-secondary text-wrap ms-1 mb-3"
                                                style={{ width: '8rem' }}
                                                key={index}
                                            >
                                                {skill}
                                            </div>
                                        )
                                    )}
                                    {/* <p className='fs-5 fw-normal text-normal ms-1'>{data.skill.join(", ")}</p> */}
                                </div>
                            )}

                            {data.is_owner && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        День рождения:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        {data.birthday}
                                    </p>
                                </div>
                            )}

                            {data.is_owner && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Компания:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        {data.company}
                                    </p>
                                </div>
                            )}

                            {data.is_owner && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        ЕГРЮЛ:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        {data.document}
                                    </p>
                                </div>
                            )}
                            {data.is_owner && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Паспорт:{' '}
                                    </p>
                                    <p className="fs-5 fw-normal ms-1">
                                        {data.passport}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="fs-1 fw-bold mb-0 text-center">
                            Проекты пользователя:
                        </p>

                        <ListGroup>
                            {data.projects.length === 0 && (
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <dotlottie-player
                                            src="https://lottie.host/93c95655-d4f2-4d6b-a56a-1da35e7900c1/RoKePYdqpU.lottie"
                                            background="transparent"
                                            speed="0.5"
                                            style={{ width: '250px' }}
                                            className="fs-3 fw-normal mb-0 text-center"
                                            loop
                                            autoplay
                                        ></dotlottie-player>
                                        <div className="ms-5">
                                            <p className="fs-3 fw-normal  ">
                                                У {data.first_name}{' '}
                                                еще нет проектов... Не будь как{' '}
                                                {data.first_name},
                                                скорее нажимай на кнопку{' '}
                                            </p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                                className="mt-3"
                                            >
                                                <Button
                                                    size="lg"
                                                    href="/create"
                                                >
                                                    Cоздать проект
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.projects.length !== 0 &&
                                data.projects.map((project) => (
                                    <ListGroupItem
                                        href={`/projects/${project.slug}`}
                                        key={project.url}
                                        action
                                    >
                                        {project.name}
                                    </ListGroupItem>
                                ))}
                        </ListGroup>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ProfileComponent;
