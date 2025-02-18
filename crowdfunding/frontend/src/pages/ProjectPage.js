import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

import EditProjectModal from '../components/forms/EditProjectModal';
import ContactCard from '../components/cards/CardContactsComponent';
import PaymentComponent from '../components/payment/PaymentComponent';
import InfoProjectCard from '../components/cards/InfoProjectCard';
import ConfirmModalProject from '../components/requests/ConfirmModalProject';
import url from '../components/functions/globalURL';
import ModalClosureMoney from '../components/requests/ModalClosureMoney';
import MoneyAdd from '../components/payment/MoneyAdd';
import TransferMoney from '../components/payment/TransferMoney';
import CreatePost from '../components/forms/CreatePost';
import PostCard from '../components/cards/PostCard';
const ProjectPage = () => {
    const [showModalConfirm, setShowModalConfirm] = useState(false); // Состояние для отображения модального окна
    const openModalConfirm = () => setShowModalConfirm(true); // Функция для открытия модального окна
    const closeModalConfirm = () => setShowModalConfirm(false); // Функция для закрытия модального окна

    const [showModalClosure, setShowModalClosure] = useState(false); // Состояние для отображения модального окна
    const openModalClosure = () => setShowModalClosure(true); // Функция для открытия модального окна
    const closeModalClosure = () => setShowModalClosure(false); // Функция для закрытия модального окна

    const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна
    const openModal = () => setShowModal(true); // Функция для открытия модального окна
    const closeModal = () => setShowModal(false); // Функция для закрытия модального окна

    const [showModalPayment, setShowModalPayment] = useState(false); // Состояние для отображения модального окна
    const openModalPayment = () => setShowModalPayment(true); // Функция для открытия модального окна
    const closeModalPayment = () => setShowModalPayment(false); // Функция для закрытия модального окна

    const [showTransferMoney, setShowTransferMoney] = useState(false); // Состояние для отображения модального окна
    const openTransferMoney = () => setShowTransferMoney(true); // Функция для открытия модального окна
    const closeTransferMoney = () => setShowTransferMoney(false); // Функция для закрытия модального окна

    const [showPostCreate, setshowPostCreate] = useState(false); // Состояние для отображения модального окна
    const openPostCreate = () => setshowPostCreate(true); // Функция для открытия модального окна
    const closePostCreat = () => setshowPostCreate(false); // Функция для закрытия модального окна

    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken != undefined) {
                const response = await fetch(url + `/projects/${slug}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                });
                const data = await response.json();
                setData(data);
                console.log(data);
            } else {
                const response = await fetch(url + `/projects/${slug}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setData(data);
                console.log(data);
            }
        };
        const fetchPosts = async () => {
            const response = await fetch(url + `/projects/${slug}/get_post/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setPosts(data);
            console.log(data);
        };

        fetchPosts();
        fetchData();
    }, [slug]);

    return (
        <Container style={{ marginTop: '80px', marginBottom: '170px' }}>
            {data && (
                <div>
                    <Carousel
                        data-bs-theme="white"
                        className="shadow rounded-4"
                    >
                        {data.project_images.map((img, pk) => (
                            <Carousel.Item key={pk}>
                                <img
                                    className="d-block w-100 shadow rounded-4"
                                    src={img.image}
                                    style={{
                                        filter: 'brightness(50%)',
                                        objectFit: 'cover',
                                        height: '20rem',
                                    }}
                                />
                                <Carousel.Caption>
                                    <h1
                                        className="mb-0 mt-0 fw-bold text-uppercase display-3"
                                        //style={{ fontSize: '3.5rem' }}
                                    >
                                        {data.name}
                                    </h1>
                                    <p
                                        className="fs-3"
                                        //style={{ fontSize: '1.5vw' }}
                                    >
                                        {data.small_description}
                                    </p>
                                    {data.status_code.code == 1 && (
                                        <div>
                                            <Button
                                                size="lg"
                                                className="mt-0"
                                                variant="outline-primarylight"
                                                onClick={openModalPayment}
                                                style={{ width: '15rem' }}
                                            >
                                                Поддержать проект
                                            </Button>

                                            {showModalPayment && (
                                                <PaymentComponent
                                                    show={true}
                                                    onHide={closeModalPayment}
                                                    slug={slug}
                                                />
                                            )}
                                        </div>
                                    )}
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    <Row className="g-4 mt-1 mb-5">
                        <Col md={8}>
                            {data && (
                                <InfoProjectCard
                                    description={data.description}
                                    collected_money={data.collected_money}
                                    need_money={data.need_money}
                                    category={data.category}
                                    status_code={data.status_code.code}
                                    className="mt-0"
                                    start_date={data.start_date}
                                    end_date={data.end_date}
                                />
                            )}{' '}
                        </Col>

                        <Col style={{}} className="mt-4 ms-2">
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
                                {data.is_owner &&
                                    data.status_code.code != 2 &&
                                    data.status_code.code != 3 && (
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
                                {data.is_owner &&
                                    data.status_code.code != 0 && (
                                        <div className="mt-1 me-1" style={{}}>
                                            <Button
                                                size="lg"
                                                variant="secondary"
                                                onClick={openPostCreate}
                                            >
                                                Добавить новость
                                            </Button>
                                            {showPostCreate && (
                                                <CreatePost
                                                    show={true}
                                                    onHide={closePostCreat}
                                                    slug={slug}
                                                />
                                            )}
                                        </div>
                                    )}
                                {data.is_owner &&
                                    data.transfer_allowed &&
                                    data.status_code.code != 3 &&
                                    data.status_code.code != 2 && (
                                        <div className="mt-1 me-1" style={{}}>
                                            <Button
                                                size="lg"
                                                variant="primary"
                                                onClick={openModalClosure}
                                            >
                                                Закрыть сбор
                                            </Button>
                                            {showModalClosure && (
                                                <ModalClosureMoney
                                                    show={true}
                                                    onHide={closeModalClosure}
                                                    slug={slug}
                                                />
                                            )}
                                        </div>
                                    )}
                                {data.is_owner &&
                                    data.transfer_allowed &&
                                    data.status_code.code == 3 && (
                                        <div className="mt-1 me-1" style={{}}>
                                            <Button
                                                size="lg"
                                                variant="primary"
                                                onClick={openTransferMoney}
                                            >
                                                Вывести деньги
                                            </Button>
                                            {showTransferMoney && (
                                                <TransferMoney
                                                    show={true}
                                                    onHide={closeTransferMoney}
                                                    slug={slug}
                                                />
                                            )}
                                        </div>
                                    )}
                                {data.is_admin && !data.confirmed && (
                                    <div className="mt-1" style={{}}>
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            onClick={openModalConfirm}
                                        >
                                            Подтвердить проект
                                        </Button>
                                        {showModalConfirm && (
                                            <ConfirmModalProject
                                                show={true}
                                                onHide={closeModalConfirm}
                                                slug={slug}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <span className="fw-bolder fs-1 ms-2">Новости проекта</span>
                    <Row xs={1} md={3} className="g-4 mt-1">
                        {posts &&
                            posts.map((post) => (
                                <Col>
                                    <PostCard
                                        slug={post.pk}
                                        name={post.name}
                                        description={post.description}
                                        image={post.image}
                                        date={post.date}
                                        user={post.user}
                                    />
                                </Col>
                            ))}
                        {posts && posts.length == 0 && (
                            <span className="ms-2 fs-5 text-secondary fw-bolder">
                                *У проекта нет новостей
                            </span>
                        )}
                    </Row>
                    {/* <span className="fs-5 "></span> */}
                </div>
            )}
        </Container>
    );
};

export default ProjectPage;

{
    /* <p className='mb-0 mt-0 fw-bold ' style={{ fontSize: '60px', }}>{data.name}</p>
						<p className='mt-0 mb-0 fs-5 text-secondary  '>{data.small_description}</p> */
}
{
    /* <div className="d-flex mt-0 mb-2">
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
                                bgcolor={'#0E7580'}
                                completed={Math.round(
                                    (data.collected_money / data.need_money) *
                                        100
                                )}
                                completed_money={data.collected_money}
                                need_money={data.need_money}
                            /> */
}
{
    /* {!data.is_owner &&
							<Button size='lg' className='mt-3' href="#">Поддержать проект</Button>
						} */
}
{
    /* <div className=" mt-3 d-block">
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
                            </Row> */
}
{
    /* <Image
                        style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            filter: 'brightness(50%)',
                            position: 'relative',
                        }}
                        src="https://avatars.mds.yandex.net/i?id=00258557af4a739f80dc1ca441f6bd48_l-8564741-images-thumbs&n=13"
                        className="shadow rounded-4"
                    />
                    <p
                        className="mb-0 mt-0 fw-bold text-uppercase"
                        style={{
                            fontSize: '5vw',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '18%',
                            left: '50%',
                            color: 'white',
                        }}
                    >
                        {data.name}
                    </p>

                    <p
                        className="mt-2"
                        style={{
                            fontSize: '2vw',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '25%',
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
                        onClick={openModalPayment}
                        style={{
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            top: '33%',
                            left: '50%',
                            width: '20%',
                        }}
                    >
                        Поддержать проект
                    </Button>

                    {showModalPayment && (
                        <PaymentComponent
                            show={true}
                            onHide={closeModalPayment}
                            slug={slug}
                        />
                    )} */
}
