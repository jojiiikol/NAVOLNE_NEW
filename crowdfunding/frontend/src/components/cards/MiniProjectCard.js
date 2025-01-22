import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import ProgressBar from '../progress-bar.component';
const MyCard = (props) => {
    const {
        slug,
        collected_money,
        need_money,
        name,
        category,
        small_description,
        views,
        image,
    } = props;
    return (
        <div>
            <a href={`/projects/${slug}`} className="text-decoration-none ">
                <Card
                    className="border-0 rounded-5 shadow row g-0 "
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    <div className="row g-0">
                        <div className="col-md-3">
                            <Card.Img
                                className="rounded-5 "
                                style={{ height: '12rem', objectFit: 'cover' }}
                                variant="top"
                                src={image}
                            />
                        </div>
                        <div className="col-9">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fs-2">{name}</Card.Title>

                                <Card.Text className="fs-5 mt-1 mb-0">
                                    {small_description}
                                </Card.Text>
                                <div style={{ marginTop: 'auto' }}>
                                    <div className="d-flex justify-content-end">
                                        <p className="aboutProject fs-4 mt-2">
                                            Подробнее о проекте
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </div>
                    </div>
                </Card>
            </a>
        </div>
    );
};

export default MyCard;
