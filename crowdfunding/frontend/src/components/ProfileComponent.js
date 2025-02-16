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
import MoneyWithdrawal from './payment/MoneyWithdrawal';
import MoneyAdd from './payment/MoneyAdd';
import AboutProfileCard from './cards/AboutProfileCard';
import getEmailMessage from './requests/getEmailMessage';
const ProfileComponent = () => {
    const { profilename } = useParams();
    const [data, setData] = useState(null);
    const [projects, setProjects] = useState(null);
    const [showRequests, setShowRequests] = useState(null);
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

    const [showModalWithdrawal, setShowModalWithdrawal] = useState(false); // Состояние для отображения модального окна
    const openModalWithdrawal = () => setShowModalWithdrawal(true); // Функция для открытия модального окна
    const closeModalWithdrawal = () => setShowModalWithdrawal(false); // Функция для закрытия модального окна

    const [showModalMoneyAdd, setShowModalMoneyAdd] = useState(false); // Состояние для отображения модального окна
    const openModalMoneyAdd = () => setShowModalMoneyAdd(true); // Функция для открытия модального окна
    const closeModalMoneyAdd = () => setShowModalMoneyAdd(false); // Функция для закрытия модального окна
    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem('accessToken')) {
                const response = await fetch(
                    url + '/profiles/' + profilename + '/',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                'Bearer ' + localStorage.getItem('accessToken'),
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
            //console.log(data);
        };
        fetchData();
    }, [profilename]);

    return (
        <Container style={{ marginTop: '80px' }}>
            {data && projects && data.code != 'token_not_valid' && (
                <div>
                    {/* <MoneyWidget /> */}
                    <Row md={3} sm={1}>
                        <Col md={3} className="mt-2">
                            <Card
                                className="border-0 rounded-5 shadow "
                                style={{ backgroundColor: '#FFFFFF' }}
                            >
                                <Card.Img
                                    style={{ height: '300px' }}
                                    src={data.image}
                                    className="me-5 object-fit-cover rounded-5"
                                ></Card.Img>
                                <Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            <Card.Text className=" fs-3 text-center fw-bold">
                                                {data.last_name}{' '}
                                                {data.first_name}
                                            </Card.Text>
                                            {!data.confirmed && (
                                                <Card.Text className="text-secondary">
                                                    {' '}
                                                    *пользователь не подтвержден
                                                </Card.Text>
                                            )}
                                        </ListGroup.Item>
                                        <ListGroup.Item></ListGroup.Item>
                                    </ListGroup>

                                    {data.is_owner && (
                                        <div>
                                            {' '}
                                            <div
                                                className="d-flex justify-content-between"
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
                                            </div>
                                            {!data.email_verified && (
                                                <div className="mt-2 d-flex justify-content-center">
                                                    {' '}
                                                    <Button
                                                        variant="secondary"
                                                        onClick={
                                                            getEmailMessage
                                                        }
                                                    >
                                                        Подтвердить почту
                                                    </Button>
                                                </div>
                                            )}
                                            {data.confirmed && (
                                                <div className="d-grid gap-2">
                                                    {' '}
                                                    <Button
                                                        variant="primary"
                                                        href="/create"
                                                        className="mt-2"
                                                    >
                                                        Создать проект
                                                    </Button>
                                                    {data.is_admin && (
                                                        <Button
                                                            variant="outline-primary"
                                                            href={
                                                                '/admin/' +
                                                                profilename
                                                            }
                                                        >
                                                            Админ панель
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={5} className="mt-2">
                            <AboutProfileCard
                                first_name={data.first_name}
                                last_name={data.last_name}
                                money={data.money}
                                company={data.company}
                                date_joined={data.date_joined}
                                total_money_sent={data.total_money_sent}
                                about={data.about}
                                skills={data.skill}
                            />
                        </Col>
                        <Col>
                            <Row className="g-5">
                                <Col></Col>
                            </Row>
                            <div className="d-flex  justify-content-between  "></div>
                            <Row>
                                <Col className="mt-2">
                                    <Card
                                        className="border-0 rounded-5 shadow "
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    >
                                        <Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>
                                                    <Card.Text className=" fs-3 text-center fw-bold">
                                                        Поддержаные проекты
                                                    </Card.Text>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <ListGroup className="list-group-flush">
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
                                                                        <div className="">
                                                                            <p className="fs-3 fw-normal text-center text-secondary ">
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
                                                                display:
                                                                    'block',
                                                            }}
                                                        >
                                                            {' '}
                                                            {projects.length !==
                                                                0 &&
                                                                projects.map(
                                                                    (
                                                                        project
                                                                    ) => (
                                                                        <ListGroup.Item
                                                                            href={`/projects/${project.slug}`}
                                                                            key={
                                                                                project.url
                                                                            }
                                                                            action
                                                                        >
                                                                            {
                                                                                project.name
                                                                            }
                                                                        </ListGroup.Item>
                                                                    )
                                                                )}
                                                        </div>
                                                    </ListGroup>
                                                </ListGroup.Item>
                                                {data.is_owner && (
                                                    <ListGroup.Item>
                                                        {data.confirmed && (
                                                            <div className="d-grid gap-2">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    onClick={
                                                                        openModalWithdrawal
                                                                    }
                                                                >
                                                                    Вывод
                                                                    средств
                                                                </Button>
                                                                {showModalWithdrawal && (
                                                                    <MoneyWithdrawal
                                                                        show={
                                                                            true
                                                                        }
                                                                        onHide={
                                                                            closeModalWithdrawal
                                                                        }
                                                                        totalmoney={
                                                                            data.money
                                                                        }
                                                                    />
                                                                )}
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={
                                                                        openModalMoneyAdd
                                                                    }
                                                                >
                                                                    Пополнить
                                                                    баланс
                                                                </Button>
                                                                {showModalMoneyAdd && (
                                                                    <MoneyAdd
                                                                        show={
                                                                            true
                                                                        }
                                                                        onHide={
                                                                            closeModalMoneyAdd
                                                                        }
                                                                        totalmoney={
                                                                            data.money
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </ListGroup.Item>
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <p className="fs-1 fw-bold mb-0 text-center mt-2">
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
                                                создавай проект
                                            </p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                                className="mt-3"
                                            ></div>
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
                                                confirmed="true"
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
