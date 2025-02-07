import React, { useEffect, useRef } from 'react';

const MoneyWidget = (show) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!window.PayoutsData) return;

        const payoutsData = new window.PayoutsData({
            type: 'payout',
            account_id: '507757',
            success_callback: function (data) {
                console.log(data);
            },
            error_callback: function (error) {
                console.error(error);
            },
        });

        payoutsData.render('widget');

        return () => {
            // Очистка при размонтаже компонента
            // payoutsData.destroy();
        };
    }, []);

    return <div id="widget"></div>;
};

export default MoneyWidget;
