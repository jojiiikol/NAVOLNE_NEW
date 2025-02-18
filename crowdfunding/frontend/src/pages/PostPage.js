import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import url from '../components/functions/globalURL';

const PostPage = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(url + `/posts/${slug}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setData(data);
            console.log(data);
        };

        fetchPosts();
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
                        <Col md={8}></Col>

                        <Col style={{}} className="mt-4 ms-2">
                            <div
                                className="d-flex flex-row-reverse"
                                style={{
                                    position: 'sticky',
                                }}
                            >
                                {/* <ContactCard
                                    email={data.user.email}
                                    first_name={data.user.first_name}
                                    last_name={data.user.last_name}
                                    username={data.user.username}
                                    image={data.user.image}
                                    slug={slug}
                                ></ContactCard> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default PostPage;
