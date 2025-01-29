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
import EditProfileModal from './forms/EditProfileModal';
import MyCard from './cards/MiniProjectCard';
import url from '../globalURL';

const ProfileComponent = () => {
    // useEffect(() => {
    // 	if (!localStorage.getItem('accessToken')) {
    // 		window.location.href = `/login`; }
    // }, []);
    const { profilename } = useParams();
    const [data, setData] = useState(null);
    const [projects, setProjects] = useState(null);

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
            const response = await fetch(
                url + '/profiles/' + profilename + '/get_payment_projects/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            const data = await response.json();
            setProjects(data);
            console.log(data);
        };
        fetchData();
    }, [profilename]);

    return (
        <Container style={{ marginTop: '80px' }}>
            {data && projects && (
                <div>
                    <Row>
                        <Col sm={3}>
                            <Image
                                style={{ width: '300px', height: '300px' }}
                                className="me-5 object-fit-cover"
                                src={data.image}
                                rounded
                                roundedCircle
                            />
                            {/* {data.skill.length !== 0 && (
                                <div className="d-flex ">
                                    {data.skill.map((skill, index) => (
                                        <h5>
                                            <Badge
                                                key={index}
                                                className="ms-1 mt-1"
                                            >
                                                {skill}
                                            </Badge>
                                        </h5>
                                    ))}
                                </div>
                            )} */}

                            <div className="d-flex justify-content-between me-5">
                                <p
                                    className="fs-5 fw-normal text-secondary mt-1"
                                    style={{ width: '300px' }}
                                >
                                    Поддержал проекты на:{' '}
                                </p>
                                <p className="fs-5 fw-normal text-normal mt-1">
                                    {' '}
                                    {data.total_money_sent}
                                </p>
                            </div>
                            {/* {data.is_owner && (
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
                            )} */}

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
                            {data.is_admin && (
                                <div
                                    className="d-flex justify-content-center mt-2"
                                    style={{}}
                                >
                                    <Button
                                        variant="primary"
                                        href="/profile_change_requests/"
                                    >
                                        Просмотреть заявки
                                    </Button>
                                </div>
                            )}
                        </Col>

                        <Col sm={9}>
                            <Row className="g-5">
                                <Col>
                                    <Badge className=" bg-secondary h-100 d-inline-flex align-items-center">
                                        <p className="fs-3 fw-bold text-black  mt-1 ms-2 me-2">
                                            {data.first_name} {data.last_name}
                                        </p>
                                    </Badge>
                                </Col>
                                <Col>
                                    <Badge className=" bg-secondary h-100 d-inline-flex align-items-center">
                                        <p className="fs-3 fw-bold text-black mt-1 ms-2 me-2 ">
                                            {data.birthday}
                                        </p>
                                    </Badge>
                                </Col>
                                <Col>
                                    <Badge className="bg-secondary h-100 d-inline-flex align-items-center">
                                        <p className="fs-3 fw-bold text-black mt-1 ms-2 me-2">
                                            {data.company}
                                        </p>
                                    </Badge>
                                </Col>
                                <Col>
                                    <Badge className=" bg-secondary ">
                                        <p className="fs-5 fw-bold text-primary mt-2 mb-0 ms-2 me-2">
                                            Мой баланс:
                                        </p>
                                        <p className="fs-4 fw-bold text-primary  mb-2 ms-2 me-2">
                                            {data.money}
                                        </p>
                                    </Badge>
                                </Col>
                            </Row>
                            <div className="d-flex  justify-content-between mt-4 "></div>
                            <Row>
                                <Col sm={7}>
                                    <Card className="mt-2">
                                        <CardHeader className="bg-black text-white fs-3 text-center fw-bold">
                                            О себе
                                        </CardHeader>
                                        <CardBody
                                            className="bg-secondary"
                                            style={{ height: '200px' }}
                                        >
                                            {data.about}
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm={5}>
                                    <Card className="mt-2" rounded>
                                        <CardHeader className="bg-black text-white fs-3 text-center fw-bold">
                                            Поддержаные проекты
                                        </CardHeader>
                                        <CardBody
                                            className="bg-secondary"
                                            style={{ height: '200px' }}
                                        >
                                            <Row>
                                                <ListGroup>
                                                    {projects &&
                                                        projects.length ===
                                                            0 && (
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        justifyContent:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <div className="ms-5">
                                                                        <p className="fs-3 fw-normal  ">
                                                                            Пользователь
                                                                            еще
                                                                            не
                                                                            поддержал
                                                                            проекты
                                                                        </p>
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    'flex',
                                                                                justifyContent:
                                                                                    'center',
                                                                            }}
                                                                            className="mt-3"
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    <div
                                                        style={{
                                                            display: 'block',
                                                        }}
                                                    >
                                                        {' '}
                                                        {projects.length !==
                                                            0 &&
                                                            projects.map(
                                                                (project) => (
                                                                    <ListGroupItem
                                                                        href={`/projects/${project.slug}`}
                                                                        key={
                                                                            project.url
                                                                        }
                                                                        action
                                                                    >
                                                                        {
                                                                            project.name
                                                                        }
                                                                    </ListGroupItem>
                                                                )
                                                            )}
                                                    </div>
                                                </ListGroup>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            {/* {data.groups.length !== 0 && (
                                <div className="d-flex">
                                    <p className="fs-5 fw-normal text-secondary">
                                        Группы:{' '}
                                    </p>

                                    <div
                                        className="badge bg-secondary text-wrap ms-1 mb-3"
                                        style={{ width: '8rem' }}
                                    >
                                        {data.groups.name}
                                    </div>

                                    
                                </div>
                            )} */}

                            {/* {data.is_owner && (
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
                            )} */}
                        </Col>
                    </Row>

                    <Row>
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
                                                У {data.first_name} еще нет
                                                проектов... Не будь как{' '}
                                                {data.first_name}, скорее
                                                нажимай на кнопку{' '}
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

                            <Row md={12}>
                                {data.projects.length !== 0 &&
                                    data.projects.map((project) => (
                                        <div className="mb-3">
                                            {' '}
                                            <MyCard
                                                className="mb-5"
                                                key={project.pk}
                                                slug={project.slug}
                                                collected_money={
                                                    project.collected_money
                                                }
                                                need_money={project.need_money}
                                                name={project.name}
                                                category={project.category}
                                                small_description={
                                                    project.small_description
                                                }
                                                views={project.views}
                                                image={project.image}
                                            />
                                        </div>
                                    ))}
                            </Row>
                        </ListGroup>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default ProfileComponent;
