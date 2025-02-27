import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    FormControl,
    ListGroup,
    Form,
} from 'react-bootstrap';
import url from '../components/functions/globalURL';
import MyCard from '../components/cards/MiniProjectCard';

const SearchComponent = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [search, setSearch] = useState(slug);
    const [sortOption, setSortOption] = useState('start_date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusCode, setStatusCode] = useState('');

    const handleChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatusCode(event.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = `/search/${search}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            const ordering =
                sortOrder === 'asc' ? sortOption : `-${sortOption}`;
            const statusQuery = statusCode
                ? `&status_code__code=${statusCode}`
                : '';
            const response = await fetch(
                `${url}/projects/?ordering=${ordering}&name=${slug}${statusQuery}`
            );
            const data = await response.json();
            setData(data);
        };

        fetchData();
    }, [slug, sortOption, sortOrder, statusCode]);

    return (
        <Container style={{ marginTop: '80px' }}>
            {data && (
                <div>
                    <Col xs={12} md={6} xl={4} className="mb-2">
                        <Form
                            className="d-flex flex-column flex-md-row"
                            onSubmit={handleSubmit}
                        >
                            <FormControl
                                type="text"
                                placeholder="Найти проект"
                                className="me-md-2 mb-2 mb-md-0"
                                value={search}
                                onChange={handleChange}
                            />
                            <Button
                                variant="outline-primary"
                                onClick={handleSubmit}
                            >
                                Найти
                            </Button>
                        </Form>
                    </Col>
                    <Col
                        xs={12}
                        md={6}
                        xl={4}
                        className=" justify-content-md-end"
                    >
                        <p className="text-secondary fw-bold mb-0 ms-2 mt-2">
                            Сортировать по:
                        </p>
                        <div className="d-flex flex-row flex-md-row justify-content-md-end">
                            <Form.Select
                                value={sortOption}
                                onChange={handleSortChange}
                                className="ms-md-2 mb-2 mb-md-0"
                            >
                                <option value="start_date">
                                    По дате начала
                                </option>
                                <option value="collected_money">
                                    Собрано средств
                                </option>
                                <option value="views_count">
                                    По просмотрам
                                </option>
                            </Form.Select>
                            <Button
                                variant="outline-secondary"
                                onClick={toggleSortOrder}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                        </div>
                    </Col>
                    <Col xs={12} md={6} xl={4}>
                        <p className="text-secondary fw-bold mb-0 ms-2 mt-2">
                            Фильтр по статусу:
                        </p>
                        <Form.Select
                            value={statusCode}
                            onChange={handleStatusChange}
                            className="ms-md-2 mb-2 mb-md-0"
                        >
                            <option value="">Все</option>
                            <option value="1">В работе</option>
                            <option value="2">
                                Сбор средств приостановлен
                            </option>
                            <option value="3">Сбор окончен</option>
                        </Form.Select>
                    </Col>

                    <p className="fs-2 fw-bold mb-0">Результаты поиска:</p>
                    <p className="text-secondary fw-bold">
                        всего найдено результатов: {data.count}
                    </p>
                    <ListGroup>
                        {data.results.length !== 0 && (
                            <Row xs={1}>
                                {data.results.map((project) => (
                                    <Col key={project.pk} className="mt-2">
                                        <MyCard
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
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </ListGroup>
                </div>
            )}
        </Container>
    );
};

export default SearchComponent;
