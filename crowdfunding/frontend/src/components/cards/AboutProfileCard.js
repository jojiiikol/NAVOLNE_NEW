import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, ListGroup, CardBody, Row, Col } from 'react-bootstrap';

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
                        <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-content-center">
                                    <span className="material-symbols-outlined my-auto text-secondary fs-4">
                                        person
                                    </span>
                                    <p className="fs-4 fw-bolder  ms-2 mb-0 ">
                                        {first_name} {last_name}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <p className="fs-5 fw-bolder text-primary align-content-center  mb-0 me-1">
                                        ₽
                                    </p>
                                    <p className="fs-5 fw-bolder text-primary align-content-center  mb-0 ">
                                        {money}
                                    </p>
                                </div>
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
                                    {date_joined}
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
                            <div className="d-flex" style={{ height: '40px' }}>
                                {skills[0] && (
                                    <span
                                        className="badge bg-primary mt-2  d-inline-flex justify-content-center align-items-center"
                                        style={{}}
                                    >
                                        {skills[0]}
                                    </span>
                                )}
                                {skills[1] && (
                                    <div
                                        className="badge bg-primary  mt-2 ms-1  d-inline-flex justify-content-center align-items-center"
                                        style={{}}
                                    >
                                        {skills[1]}
                                    </div>
                                )}
                                {skills[2] && (
                                    <div
                                        className="badge bg-primary  mt-2 ms-1  d-inline-flex justify-content-center align-items-center"
                                        style={{}}
                                    >
                                        {skills[2]}
                                    </div>
                                )}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <CardBody style={{ height: '200px' }}>
                                {about}
                            </CardBody>
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AboutProfileCard;
