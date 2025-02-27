import React from 'react';
import { Card } from 'react-bootstrap';
import formatDate from '../functions/formatdate';
const PostCard = (props) => {
    const { slug, name, description, image, date, user, onClick } = props;
    let adress = slug ? `/posts/${slug}` : null; // Если slug пустой, не нужно создавать ссылку

    const handleClick = () => {
        if (onClick) onClick(); // Вызовем функцию для открытия модального окна
    };

    return (
        <div>
            <a
                href={adress || '#'}
                className="text-decoration-none"
                onClick={handleClick}
            >
                <Card
                    className="border-0 rounded-5 shadow row g-0"
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

                            {date && <span>{formatDate(date)}</span>}
                        </div>
                    </Card.Body>
                </Card>
            </a>
        </div>
    );
};

export default PostCard;
