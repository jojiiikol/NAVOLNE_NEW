import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, ListGroup } from 'react-bootstrap';
import ProgressBar from './progress-bar.component';
import formatDate from '../functions/formatdate';
const InfoProjectCard = (props) => {
    const {
        description,
        collected_money,
        need_money,
        category,
        status_code,
        start_date,
        end_date,
    } = props;
    return (
        <div>
            <Card className="shadow border-0 rounded-4">
                <Card.Body>
                    <Card.Title className="fs-4 center text-center ">
                        О проекте
                    </Card.Title>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item></ListGroup.Item>
                        <ListGroup.Item className="">
                            <div className="d-flex justify-content-between">
                                <span className="text-secondary fs-5 text-uppercase">
                                    Описание
                                </span>
                                {status_code != 2 && status_code != 3 && (
                                    <div
                                        className="d-flex"
                                        style={{ height: '40px' }}
                                    >
                                        {category[0] && (
                                            <span
                                                className="badge bg-primary  ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                                style={{
                                                    height: '30px',
                                                    padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                                    fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                                }}
                                            >
                                                {category[0]}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {status_code != 1 && status_code != 0 && (
                                    <div
                                        className="d-flex"
                                        style={{ height: '40px' }}
                                    >
                                        {category[0] && (
                                            <span
                                                className="badge bg-warning  ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                                style={{
                                                    height: '30px',
                                                    padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                                    fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                                }}
                                            >
                                                {category[0]}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p>{description}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {' '}
                            <ProgressBar
                                bgcolor={'#0E7580'}
                                completed={Math.round(
                                    (collected_money / need_money) * 100
                                )}
                                completed_money={collected_money}
                                need_money={need_money}
                                code={status_code}
                            />
                            <div className="d-flex justify-content-between">
                                {' '}
                                <span className="fw-bold text-secondary">
                                    {formatDate(start_date)}
                                </span>
                                <span className="fw-bold text-secondary">
                                    {formatDate(end_date)}
                                </span>
                            </div>
                            {status_code == 2 && (
                                <div className="d-flex justify-content-center">
                                    <p className="fs-5 fw-bolder">
                                        Сбор приостановлен
                                    </p>
                                </div>
                            )}
                            {status_code == 3 && (
                                <div className="d-flex justify-content-center">
                                    <p className="fs-5 fw-bolder">
                                        Сбор окончен
                                    </p>
                                </div>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default InfoProjectCard;
