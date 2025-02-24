import React from 'react';
import { Card } from 'react-bootstrap';

const PostCard = (props) => {
    const { slug, name, description, image, date, user } = props;
    let adress = `/posts/${slug}`;

    return (
        <div>
            <a href={adress} className="text-decoration-none ">
                <Card
                    className="border-0 rounded-5 shadow row g-0 "
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    <Card.Img
                        className="rounded-5 shadow"
                        src={image}
                        style={{ height: 200, objectFit: 'cover' }}
                    ></Card.Img>
                    <Card.Body>
                        <span
                            className="fs-3 fw-bolder"
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%', // Ограничение ширины
                                display: 'block', // Чтобы работали остальные свойства
                            }}
                        >
                            {name}
                        </span>
                        <div className="d-flex text-secondary justify-content-between fw-bolder">
                            <div>
                                <span className="me-1">{user.first_name}</span>
                                <span>{user.last_name}</span>
                            </div>

                            <span>{date}</span>
                        </div>
                    </Card.Body>
                </Card>
            </a>
        </div>
    );
};

export default PostCard;
