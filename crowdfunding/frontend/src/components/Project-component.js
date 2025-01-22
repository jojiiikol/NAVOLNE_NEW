import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Col, Row } from 'react-bootstrap';
import ProgressBar from '../components/progress-bar.component.js';
import {
    MDBPagination,
    MDBPaginationItem,
    MDBPaginationLink,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import '../css/home.css';
import MyCard from '../components/cards/CardComponent.js';
import PaymentComponent from '../components/PaymentComponent.js';
import url from '../globalURL';
const PaginationComponent = () => {
    const [data, setData] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    useEffect(() => {
        fetchData(url + '/projects/');
    }, []);

    const fetchData = (url) => {
        axios
            .get(url)
            .then((response) => {
                setData(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
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
        <Container style={{ marginTop: '70px' }}>
            <h2 className="text-center m-4">Все проекты</h2>

            <MDBPagination
                circle
                className="m-4"
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <MDBPaginationItem>
                    <MDBPaginationLink
                        href="#"
                        tabIndex={-1}
                        onClick={handlePrevPage}
                    >
                        Предыдущая
                    </MDBPaginationLink>
                </MDBPaginationItem>

                <MDBPaginationItem onClick={handleNextPage}>
                    <MDBPaginationLink href="#">Следующая</MDBPaginationLink>
                </MDBPaginationItem>
            </MDBPagination>

            <Row xs={1} md={2} className="g-4">
                {data.map((item) => (
                    <Col>
                        <MyCard
                            key={item.pk}
                            slug={item.slug}
                            collected_money={item.collected_money}
                            need_money={item.need_money}
                            name={item.name}
                            category={item.category}
                            small_description={item.small_description}
                            views={item.views}
                            image={item.image}
                            code={item.status_code.code}
                        />
                    </Col>
                ))}
            </Row>

            <MDBPagination
                circle
                className="m-4"
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <MDBPaginationItem>
                    <MDBPaginationLink
                        href="#"
                        tabIndex={-1}
                        onClick={handlePrevPage}
                    >
                        Предыдущая
                    </MDBPaginationLink>
                </MDBPaginationItem>

                <MDBPaginationItem onClick={handleNextPage}>
                    <MDBPaginationLink href="#">Следующая</MDBPaginationLink>
                </MDBPaginationItem>
            </MDBPagination>
        </Container>
    );
};

export default PaginationComponent;
