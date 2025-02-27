import React from 'react';
import { Card } from 'react-bootstrap';
import ProgressBar from './progress-bar.component';
import 'aos/dist/aos.css';
import AOS from 'aos';
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
        start_date,
        end_date,
    } = props;

    return (
        <div data-aos="fade-up">
            <a href={`/projects/${slug}`} className="text-decoration-none">
                <Card
                    className="border-0 rounded-5 shadow"
                    style={{ backgroundColor: '#FFFFFF' }}
                >
                    {code === 1 && (
                        <Card.Img
                            className="rounded-5 shadow"
                            style={{ height: 200, objectFit: 'cover' }}
                            variant="top"
                            src={image}
                        />
                    )}
                    {(code === 2 || code === 3) && (
                        <Card.Img
                            className="rounded-5"
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
                        <Card.Title
                            className="fs-1"
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                                display: 'block',
                            }}
                        >
                            {name}
                        </Card.Title>
                        {code !== 2 && code !== 3 && (
                            <div className="d-flex" style={{ height: '40px' }}>
                                {category[0] && (
                                    <span
                                        style={{
                                            height: '30px',
                                            padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                            fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                        }}
                                        className="badge bg-primary ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                    >
                                        {category[0]}
                                    </span>
                                )}
                                {category[1] && (
                                    <div
                                        style={{
                                            height: '30px',
                                            padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                            fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                        }}
                                        className="badge bg-primary ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                    >
                                        {category[1]}
                                    </div>
                                )}
                            </div>
                        )}
                        {code !== 0 && code !== 1 && (
                            <div className="d-flex" style={{ height: '40px' }}>
                                {category[0] && (
                                    <span
                                        style={{
                                            height: '30px',
                                            padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                            fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                        }}
                                        className="badge bg-warning ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                    >
                                        {category[0]}
                                    </span>
                                )}
                                {category[1] && (
                                    <div
                                        style={{
                                            height: '30px',
                                            padding: '0.5rem 1rem', // Увеличенные отступы для лучшего восприятия
                                            fontSize: '1rem', // Уменьшенный размер шрифта для лучшей читаемости
                                        }}
                                        className="badge bg-warning ms-1 mb-1 d-inline-flex justify-content-center align-items-center"
                                    >
                                        {category[1]}
                                    </div>
                                )}
                            </div>
                        )}

                        <Card.Text className="fs-5" style={{ height: '3em' }}>
                            {small_description}
                        </Card.Text>
                        <div style={{ marginTop: 'auto' }}>
                            {code === 1 && <Card.Text>Собрано:</Card.Text>}
                            {code === 2 && (
                                <Card.Text>Сбор приостановлен</Card.Text>
                            )}
                            {code === 3 && <Card.Text>Сбор окончен</Card.Text>}
                            <ProgressBar
                                completed={Math.round(
                                    (collected_money / need_money) * 100
                                )}
                                completed_money={collected_money}
                                need_money={need_money}
                                code={code}
                            />
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="aboutProject fs-4 mt-2">
                                    Подробнее о проекте
                                </p>
                                <div className="d-flex me-2 my-auto">
                                    <span className="material-symbols-outlined d-inline-flex justify-content-center align-items-center text-secondary">
                                        visibility
                                    </span>
                                    <span className="d-inline-flex justify-content-center align-items-center ms-1 fs-5 text-secondary">
                                        {views}
                                    </span>
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
