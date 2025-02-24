import { useState } from 'react';

const About = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: 'Что такое краудфандинг?',
            answer: 'Краудфандинг — это способ коллективного финансирования проектов, когда множество людей вкладывают небольшие суммы для реализации идеи.',
        },
        {
            question: 'Как инвестировать в проект?',
            answer: 'Выберите интересующий проект, ознакомьтесь с условиями, и внесите сумму удобным для вас способом.',
        },
        {
            question: 'Как создать свой проект?',
            answer: 'Зарегистрируйтесь, опишите идею, добавьте цель финансирования, изображения и запустите кампанию!',
        },
        {
            question: 'Какие гарантии у инвесторов?',
            answer: 'Проекты проходят проверку, а собранные средства передаются авторам только при достижении заявленной суммы.',
        },
        {
            question: 'Что делать, если проект не собрал нужную сумму?',
            answer: 'Если проект не достигает цели, собранные средства могут быть возвращены инвесторам или направлены на частичную реализацию.',
        },
    ];

    return (
        <div className="faq-section" data-aos="fade-up">
            <h1 className="faq-title">Часто задаваемые вопросы</h1>
            <div className="faq-container">
                {faqData.map((item, index) => (
                    <div key={index} className="faq-item">
                        <button
                            className={`faq-question ${openIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            {item.question}
                            <span
                                className={`faq-icon ${openIndex === index ? 'rotate' : ''}`}
                            >
                                ▼
                            </span>
                        </button>
                        <div
                            className={`faq-answer ${openIndex === index ? 'show' : ''}`}
                        >
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
