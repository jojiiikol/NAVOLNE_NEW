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

                            console.log(data);
                            if (data.code == 'token_not_valid') {
                                localStorage.clear();
                            }
                            window.location.reload();
                        });
                    console.log('token refreshed');
                    //
                }
            });
    }
};
export default TokenCheck;
