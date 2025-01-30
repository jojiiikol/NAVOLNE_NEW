import React from 'react';
import { Form } from 'react-bootstrap';

const EditedBlock = (props) => {
    const { name, data } = props;
    return (
        <div>
            {data && (
                <Form.Group className="mb-2 d-flex ">
                    <div className="me-2">{name}</div>
                    <div>{data}</div>
                </Form.Group>
            )}
        </div>
    );
};

export default EditedBlock;
