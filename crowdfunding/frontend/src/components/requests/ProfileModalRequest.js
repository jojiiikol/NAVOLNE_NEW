import React, { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';

const ProfileModalRequest = ({ show, onHide, id }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();
    const { current: myArray } = useRef(['one', 'two', 'three']);
    useEffect(() => {
        if (!id) return; // Проверяем, существует ли id, прежде чем делать запрос
        const fetchData = async () => {
            try {
                setIsLoading(true); // Включаем индикатор загрузки
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(
                    url+`/profile_change_requests/${id}/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + accessToken,
                        },
                    }
                );
                const fetchedData = await response.json();
                setData(fetchedData);
                console.log(fetchedData);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            } finally {
                setIsLoading(false); // Выключаем индикатор загрузки
            }
        };

        fetchData();
    }, [id]); // Запускаем эффект только при изменении id

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Просмотр заявки</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Modal.Footer className="">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                    >
                        Сохранить
                    </Button>
                    <Button variant="secondary" onClick={onHide}>
                        Отменить
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileModalRequest;
