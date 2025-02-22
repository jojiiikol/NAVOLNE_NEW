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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setSearch(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = '/search/' + search;
        setSearch('');
    };
    useEffect(() => {
        const fetchData = async () => {
            console.log(slug);
            const response = await fetch(url + `/projects/?name=${slug}`);
            const data = await response.json();
            setData(data);
            console.log(data);
        };

        fetchData();
    }, [slug]);

    return (
        <Container style={{ marginTop: '80px' }}>
            {data && (
                <div>
                    <Row xs={1} md={2}>
                        <Col>
                            {' '}
                            <Form className="d-flex" onSubmit={handleSubmit}>
                                <FormControl
                                    type="text"
                                    placeholder="Найти проект"
                                    className="me-sm-2"
                                    name="search"
                                    value={search}
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outline-primary"
                                    className="me-sm-5"
                                    onClick={handleSubmit}
                                >
                                    Найти
                                </Button>
                            </Form>
                        </Col>
                    </Row>

                    <p className="fs-2 fw-bold mb-0 ">Результаты поиска:</p>
                    <p className="text-secondary fw-bold">
                        всего найдено результатов: {data.count}
                    </p>
                    <ListGroup>
                        {data.results.length != 0 && (
                            <div>
                                {' '}
                                <Row md={12}>
                                    {data.results.map((project) => (
                                        <div className="mt-2">
                                            {' '}
                                            <MyCard
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
                            </div>
                        )}
                    </ListGroup>
                </div>
            )}
        </Container>
    );
};

export default SearchComponent;
