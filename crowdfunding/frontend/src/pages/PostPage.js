import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import url from '../components/functions/globalURL';
import ContactCard from '../components/cards/CardContactsComponent';
import MyCard from '../components/cards/MiniProjectCard';
const PostPage = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [project, setProject] = useState(null);
    const [projecturl, setProjectUrl] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${url}/posts/${slug}`);
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const data = await response.json();

                setData(data);
                setProjectUrl(data.project_url); // Установим projectUrl
                console.log(data);

                // Теперь делаем второй запрос, используя установленную projectUrl
                const projectResponse = await fetch(data.project_url);
                if (!projectResponse.ok)
                    throw new Error('Network response for project was not ok');
                const projectData = await projectResponse.json();

                setProject(projectData);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        fetchPosts(); // Вызываем функцию для выполнения запросов
    }, [slug]);

    return (
        <Container style={{ marginTop: '80px', marginBottom: '170px' }}>
            {data && (
                <div>
                    <Carousel
                        data-bs-theme="white"
                        className="shadow rounded-4"
                    >
                        {data.post_images.map((img, pk) => (
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
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    <Row className="g-4 mt-1 mb-5">
                        <Col md={8}>
                            {' '}
                            <Card className="shadow border-0 rounded-4">
                                <Card.Body>
                                    <Card.Title className="fs-4 mt-2 ms-3 ">
                                        {data.name}
                                    </Card.Title>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item></ListGroup.Item>
                                        <ListGroup.Item className="">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-secondary fs-5 text-uppercase">
                                                    Описание
                                                </span>
                                                <span>{data.date}</span>
                                            </div>
                                            <p>{data.description}</p>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
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
                        </Col>
                    </Row>
                    {project && (
                        <MyCard
                            className="mb-5"
                            key={project.pk}
                            slug={project.slug}
                            collected_money={project.collected_money}
                            need_money={project.need_money}
                            name={project.name}
                            category={project.category}
                            small_description={project.small_description}
                            views={project.views}
                            image={project.image}
                            confirmed="true"
                        />
                    )}
                </div>
            )}
        </Container>
    );
};

export default PostPage;
