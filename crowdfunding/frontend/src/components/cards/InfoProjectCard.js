import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, ListGroup } from 'react-bootstrap';
import ProgressBar from '../progress-bar.component';
const InfoProjectCard = (props) => {
    const { description, collected_money, need_money, category } = props;
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
                                <div className="d-flex mt-0 mb-2">
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
                            />
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default InfoProjectCard;
