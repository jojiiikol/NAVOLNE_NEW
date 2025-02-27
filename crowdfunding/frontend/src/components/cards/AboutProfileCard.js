import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    Image,
    ListGroup,
    CardBody,
    Row,
    Col,
    Badge,
} from 'react-bootstrap';
import formatDate from '../functions/formatdate';
const AboutProfileCard = (props) => {
    const {
        first_name,
        last_name,
        money,
        company,
        date_joined,
        total_money_sent,
        about,
        skills,
        is_owner,
    } = props;
    return (
        <div>
            <Card
                className="border-0 rounded-5 shadow "
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>
                            <Card.Text className=" fs-3 text-center fw-bold">
                                О себе
                            </Card.Text>
                        </ListGroup.Item>
                        <ListGroup.Item className="mb-0">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-content-center">
                                    <span className="material-symbols-outlined my-auto text-secondary fs-4">
                                        person
                                    </span>
                                    <p className="fs-4 fw-bolder  ms-2 mb-0 ">
                                        {first_name} {last_name}
                                    </p>
                                </div>
                                {is_owner && (
                                    <div className="d-flex justify-content-end">
                                        <p className="fs-5 fw-bolder text-primary align-content-center  mb-0 me-1">
                                            ₽
                                        </p>
                                        <p className="fs-5 fw-bolder text-primary align-content-center  mb-0 ">
                                            {money}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex align-content-center">
                                {' '}
                                <span class="material-symbols-outlined my-auto text-secondary">
                                    work
                                </span>
                                <p className="fs-5 fw-bolder text-secondary  ms-2 mb-0 ">
                                    {company}
                                </p>
                            </div>
                            <div className="d-flex align-content-center">
                                {' '}
                                <span class="material-symbols-outlined my-auto text-secondary">
                                    event
                                </span>
                                <p className="fs-5 fw-bolder text-secondary  ms-2 mb-0 ">
                                    {formatDate(date_joined)}
                                </p>
                            </div>
                            <div className="d-flex align-content-center">
                                {' '}
                                <span class="material-symbols-outlined my-auto text-secondary">
                                    payments
                                </span>
                                <p className="fs-5 fw-bolder text-secondary align-content-center  ms-2 mb-0 ">
                                    {total_money_sent}
                                </p>
                            </div>
                            {skills.length > 0 && (
                                <div
                                //className="d-flex"
                                //style={{ height: '40px' }}
                                >
                                    <Row xs={2} md={2} xl={2} className="mb-0">
                                        {skills.map((skill, index) => (
                                            <Col key={index}>
                                                <span
                                                    className="badge bg-primary mt-2 d-inline-flex justify-content-center align-items-center"
                                                    style={{
                                                        height: '30px',
                                                        padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                                        fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item className="mt-0">
                            <div style={{ height: '200px' }}>
                                <p className="fs-5 fw-bolder text-secondary mt-0 mb-0">
                                    О себе:
                                </p>
                                {about}
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AboutProfileCard;
