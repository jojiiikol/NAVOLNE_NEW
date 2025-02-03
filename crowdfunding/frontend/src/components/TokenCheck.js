import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Image,
    Button,
    ListGroup,
    ListGroupItem,
    Badge,
    CardHeader,
    Card,
    CardBody,
    Row,
    Col,
} from 'react-bootstrap';
import url from '../globalURL';
const TokenCheck = () => {
    if (localStorage.getItem('accessToken')) {
        const formDataVerify = new FormData();
        let answer = 0;
        formDataVerify.append('token', localStorage.getItem('accessToken'));
        fetch(url + '/api/token/verify/', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
            },
            body: formDataVerify,
        })
            .then((response) => response.json())
            .then((data) => {
                answer = data.code;

                if (answer == 'token_not_valid') {
                    const formData = new FormData();
                    formData.append(
                        'refresh',
                        localStorage.getItem('refreshToken')
                    );

                    fetch(url + '/api/token/refresh/', {
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'application/json',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            localStorage.setItem('accessToken', data.access);
                            //console.log('token refreshed');
                        });
                    console.log('token refreshed');
                    //window.location.reload();
                }
            });
    }
};
export default TokenCheck;
