import React from 'react';

const ProgressBar = (props) => {
    const { completed, completed_money, need_money } = props;

    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 50,
        marginBottom: 10,
    };

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: '#0E7580',
        borderRadius: 'inherit',
        textAlign: 'right',
    };
    const fillerStyles100 = {
        height: '100%',
        width: '100%',
        backgroundColor: '#0E7580',
        borderRadius: 'inherit',
        textAlign: 'right',
    };

    const labelStyles = {
        paddingRight: 10,
        color: 'white',
        fontWeight: 'bold',
        left: '1%',
        top: '0%',
        textAlign: 'center',
    };
    const labelStyles2 = {
        padding: 10,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={labelStyles2}>{`${completed_money} ₽`}</span>
                <span style={labelStyles2}>{`${need_money} ₽`}</span>
            </div>

            <div style={containerStyles}>
                {completed_money / need_money < 1 && (
                    <div style={fillerStyles}>
                        {completed_money / need_money > 0.1 && (
                            <span
                                style={labelStyles}
                                className="align-self-center"
                            >{`${completed}%`}</span>
                        )}
                    </div>
                )}
                {completed_money / need_money >= 1 && (
                    <div style={fillerStyles100}>
                        {completed_money / need_money > 0.1 && (
                            <span
                                style={labelStyles}
                                className="align-self-center"
                            >{`${completed}%`}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
