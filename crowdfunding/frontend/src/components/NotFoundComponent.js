import React from 'react';

const NotFoundComponent = () => {
    return (
        <div className=" mt-5">
            <div className="d-flex justify-content-center">
                {' '}
                <dotlottie-player
                    src="https://lottie.host/e6bce340-5444-4c55-af80-35b05b04babd/bN9BAKwSND.lottie"
                    background="transparent"
                    speed="0.5"
                    style={{ width: '80vh' }}
                    className="fs-3 fw-normal mb-0 text-center"
                    loop
                    autoplay
                ></dotlottie-player>
            </div>

            <h1 className="d-flex justify-content-center">
                Страница не найдена
            </h1>
        </div>
    );
};

export default NotFoundComponent;
