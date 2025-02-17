import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import url from '../functions/globalURL';
const getEmailMessage = () => {
    fetch(url + '/profiles/get_email_verification_message/', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            alert('Проверьте вашу почту');
        });
};
export default getEmailMessage;
