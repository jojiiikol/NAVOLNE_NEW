import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, ListGroup } from 'react-bootstrap';

const TopDonaters = (props) => {
    const { data } = props;
    console.log(data);
    return (
        <div>
            <Card
                style={{ width: '23rem' }}
                className="shadow border-0 rounded-4 mt-3"
            >
                <Card.Body>
                    <Card.Title className="fs-4 center text-center">
                        Топ донатеры
                    </Card.Title>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item></ListGroup.Item>
                        <ListGroup.Item>
                            {data &&
                                data.map((user) => (
                                    <div className="mt-2 d-flex ">
                                        <a
                                            href={`/profile/${user.user.username}`}
                                        >
                                            <Image
                                                src={user.user.image}
                                                roundedCircle
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                }}
                                                className="border border-primary border-3 shadow-sm"
                                                href={`/profile/${user.user.username}`}
                                            ></Image>
                                        </a>

                                        <div className="ms-3">
                                            <p className="fs-5 fw-bold mb-0">
                                                {user.user.first_name}{' '}
                                                {user.user.last_name}
                                            </p>
                                            {/* <div className="d-flex ">
                                                <span className="material-symbols-outlined my-auto text-secondary">
                                                    person
                                                </span>
                                                <p className="d-flex align-items-center ms-1 align-middle my-auto text-secondary">
                                                    {user.user.username}
                                                </p>
                                            </div> */}
                                            <div className="d-flex ">
                                                <p className="text-primary fw-bolder mb-0 ms-1">
                                                    ₽ {user.money}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {data && data.length == 0 && (
                                <span className="fw-bolder text-secondary">
                                    *проект еще никто не поддержал
                                </span>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TopDonaters;
