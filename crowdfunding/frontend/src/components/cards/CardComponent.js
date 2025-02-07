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
        code,
    } = props;
    return (
        <div>
            <a href={`/projects/${slug}`} className="text-decoration-none ">
                <Card
                    className="border-0 rounded-5 shadow"
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    {code == 1 && (
                        <Card.Img
                            className="rounded-5 "
                            style={{ height: 200, objectFit: 'cover' }}
                            variant="top"
                            src={image}
                        />
                    )}
                    {code == 2 && (
                        <Card.Img
                            className="rounded-5 "
                            style={{
                                height: 200,
                                objectFit: 'cover',
                                filter: 'saturate(20%)',
                            }}
                            variant="top"
                            src={image}
                        />
                    )}
                    {code == 3 && (
                        <Card.Img
                            className="rounded-5 "
                            style={{
                                height: 200,
                                objectFit: 'cover',
                                filter: 'saturate(20%)',
                            }}
                            variant="top"
                            src={image}
                        />
                    )}
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="fs-1">{name}</Card.Title>
                        <div className="d-flex">
                            {category.map((category, index) => (
                                <div
                                    className="badge bg-primary text-wrap ms-1 mb-1"
                                    style={{ width: '6rem' }}
                                    key={index}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                        <Card.Text className="fs-5" style={{ height: '3em' }}>
                            {small_description}
                        </Card.Text>
                        <div style={{ marginTop: 'auto' }}>
                            {code == 1 && <Card.Text>Собрано:</Card.Text>}
                            {code == 2 && (
                                <Card.Text>Сбор приостановлен</Card.Text>
                            )}
                            {code == 3 && <Card.Text>Сбор окончен</Card.Text>}
                            <ProgressBar
                                completed={Math.round(
                                    (collected_money / need_money) * 100
                                )}
                                completed_money={collected_money}
                                need_money={need_money}
                            />
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="aboutProject fs-4 mt-2">
                                    Подробнее о проекте
                                </p>
                                <div className="d-flex me-2 my-auto">
                                    <span className="material-symbols-outlined my-auto">
                                        visibility
                                    </span>
                                    <p className="d-flex align-items-center ms-1 align-middle my-auto fs-5">
                                        {views}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </a>
        </div>
    );
};

export default MyCard;
