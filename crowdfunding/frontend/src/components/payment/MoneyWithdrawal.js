import React, { useState, useRef } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useEffect } from 'react';
import url from '../../globalURL';
import MoneyWidget from './MoneyWidget';
const MoneyWithdrawal = ({ show, onHide }) => {
    const [formData, setFormData] = useState({}); // Состояние данных формы
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [data, setData] = useState();

    const handleSubmit = async (event) => {};
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Body>
                    <MoneyWidget></MoneyWidget>
                    <Modal.Footer className="">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            Сохранить
                        </Button>
                        <Button variant="secondary" onClick={onHide}>
                            Отменить
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MoneyWithdrawal;
