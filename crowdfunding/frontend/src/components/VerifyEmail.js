import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import url from '../globalURL';
const Verify = () => {
    const { token } = useParams(); // Получаем токен из URL

    useEffect(() => {
        if (!token) return;

        fetch(url + `/verify/${token}/`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert('Email подтвержден!');
                    window.location.href = '/home'; // Перенаправляем на главную
                } else {
                    alert('Ошибка подтверждения');
                }
            })
            .catch(() => alert('Ошибка сервера'));
    }, [token]);

    return <h2>Подтверждение email...</h2>;
};
export default Verify;
