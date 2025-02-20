import React, { Component, useEffect, useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import PostCard from '../components/cards/PostCard';
import {
    MDBPagination,
    MDBPaginationItem,
    MDBPaginationLink,
} from 'mdb-react-ui-kit';
import url from '../components/functions/globalURL';
import axios from 'axios';
const News = () => {
    const [posts, setPosts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    useEffect(() => {
        fetchData(url + '/posts/');
    }, []);
    const fetchData = (url) => {
        axios
            .get(url)
            .then((response) => {
                setPosts(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                console.log(response);
            })

            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };
    const handleNextPage = () => {
        if (nextPage) {
            fetchData(nextPage);
        }
    };
    const handlePrevPage = () => {
        if (prevPage) {
            fetchData(prevPage);
        }
    };

    return (
        <>
            <Container
                fluid
                style={{
                    marginTop: '80px',
                }}
            >
                <p className="fs-2 fw-bold mb-0 ">Новости по проектам:</p>
                <MDBPagination
                    circle
                    className="m-4"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    {!prevPage && <div></div>}
                    {prevPage && (
                        <MDBPaginationItem>
                            <Button
                                href="#"
                                tabIndex={-1}
                                onClick={handlePrevPage}
                            >
                                Предыдущая
                            </Button>
                        </MDBPaginationItem>
                    )}
                    {!nextPage && <div></div>}
                    {nextPage && (
                        <MDBPaginationItem onClick={handleNextPage}>
                            <Button href="#">Следующая</Button>
                        </MDBPaginationItem>
                    )}
                </MDBPagination>

                {posts && (
                    <Row xs={1} md={4} className="g-4 mt-2 mb-3">
                        {posts.map((post) => (
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
                    </Row>
                )}
                <MDBPagination
                    circle
                    className="m-4"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    {!prevPage && <div></div>}
                    {prevPage && (
                        <MDBPaginationItem>
                            <Button
                                href="#"
                                tabIndex={-1}
                                onClick={handlePrevPage}
                            >
                                Предыдущая
                            </Button>
                        </MDBPaginationItem>
                    )}
                    {!nextPage && <div></div>}
                    {nextPage && (
                        <MDBPaginationItem onClick={handleNextPage}>
                            <Button href="#">Следующая</Button>
                        </MDBPaginationItem>
                    )}
                </MDBPagination>
            </Container>
        </>
    );
};

export default News;
