import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Image,
    Row,
    Col,
    Button,
    Card,
    CardBody,
} from 'react-bootstrap';
import ProgressBar from './progress-bar.component';
import EditProjectModal from './EditProjectModal';
import ContactCard from './CardContactsComponent';
import PaymentComponent from './PaymentComponent';
const ProjectPage = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна
    const [showModal2, setShowModal2] = useState(false); // Состояние для отображения модального окна
    const openModal2 = () => setShowModal2(true); // Функция для открытия модального окна
    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal2 = () => setShowModal2(false); // Функция для закрытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна
    const { slug } = useParams();
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken != undefined) {
                const response = await fetch(
                    `http://localhost:8000/projects/${slug}/`,
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
            } else {
                const response = await fetch(
                    `http://localhost:8000/projects/${slug}/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setData(data);
                console.log(data);
            }
        };

        fetchData();
    }, [slug]);

    return (
        <Container style={{ marginTop: '80px', marginBottom: '170px' }}>
            {data && (
                <div>
                    <Image
                        style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            filter: 'brightness(50%)',
                            position: 'relative',
                        }}
                        src="https://png.pngtree.com/back_origin_pic/00/02/16/cd1f6288c79730c5c2e50e9498dbb00b.jpg"
                        className="shadow rounded-4"
                    />
                    <p
                        className="mb-0 mt-0 fw-bold text-uppercase"
                        style={{
                            fontSize: '70px',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '17%',
                            left: '50%',
                            color: 'white',
                        }}
                    >
                        {data.name}
                    </p>

                    <p
                        className="mt-1"
                        style={{
                            fontSize: '30px',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '23%',
                            left: '50%',
                            color: 'white',
                        }}
                    >
                        {data.small_description}
                    </p>
                    <Button
                        size="lg"
                        className="mt-0"
                        variant="outline-primarylight"
                        onClick={openModal2}
                        style={{
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '30%',
                            left: '50%',
                            width: '20%',
                        }}
                    >
                        Поддержать проект
                    </Button>

                    {showModal2 && (
                        <PaymentComponent
                            show={true}
                            onHide={closeModal2}
                            slug={slug}
                        />
                    )}
                    <Row className="g-4 mt-1">
                        <Col sm={7}>
                            {/* <p className='mb-0 mt-0 fw-bold ' style={{ fontSize: '60px', }}>{data.name}</p>
						<p className='mt-0 mb-0 fs-5 text-secondary  '>{data.small_description}</p> */}
                            <div className="d-flex mt-0 mb-2">
                                {data.category.map((category, index) => (
                                    <div
                                        className="badge bg-secondary text-wrap ms-1 mb-1"
                                        style={{ width: '6rem' }}
                                        key={index}
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                            <ProgressBar
                                bgcolor={'#0d6efd'}
                                completed={Math.round(
                                    (data.collected_money / data.need_money) *
                                        100
                                )}
                                completed_money={data.collected_money}
                                need_money={data.need_money}
                            />
                            {/* {!data.is_owner &&
							<Button size='lg' className='mt-3' href="#">Поддержать проект</Button>
						} */}
                            <div className=" mt-3 d-block">
                                <span className="text-secondary fs-3 ">
                                    О проекте:
                                </span>
                            </div>
                            <Row>
                                <Col
                                    className="fs-5 mt-3"
                                    style={{ textAlign: 'justify ' }}
                                >
                                    {data.description}
                                </Col>
                            </Row>
                        </Col>

                        <Col style={{ paddingLeft: '10px' }} className="mt-2">
                            <div
                                className="d-flex flex-row-reverse"
                                style={{
                                    position: 'sticky',
                                }}
                            >
                                <ContactCard
                                    email={data.user.email}
                                    first_name={data.user.first_name}
                                    last_name={data.user.last_name}
                                    username={data.user.username}
                                    image={data.user.image}
                                    slug={slug}
                                ></ContactCard>
                            </div>

                            <div className="d-flex flex-row-reverse">
                                {data.is_owner && (
                                    <div className="mt-1" style={{}}>
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            onClick={openModal}
                                        >
                                            Редактировать
                                        </Button>
                                        {showModal && (
                                            <EditProjectModal
                                                show={true}
                                                onHide={closeModal}
                                                slug={slug}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* <span className="fs-5 "></span> */}
                </div>
            )}
        </Container>
    );
};

export default ProjectPage;
