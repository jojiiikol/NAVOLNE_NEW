import React, { useEffect, useRef } from 'react';

const MoneyWidget = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!window.PayoutsData) return;

        const payoutsData = new window.PayoutsData({
            type: 'payout',
            account_id: '<507757>',
            success_callback: function (data) {
                // Обработка ответа с токеном карты
            },
            error_callback: function (error) {
                // Обработка ошибок при получении токена карты
            },
        });

        payoutsData.render(containerRef.current);

        return () => {
            // Очистка при размонтаже компонента
            payoutsData.destroy();
        };
    }, []);

    return <div ref={containerRef}></div>;
};

export default MoneyWidget;
