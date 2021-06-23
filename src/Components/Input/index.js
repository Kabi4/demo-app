import React, { useRef, useState } from 'react';
import './style.css';
const Index = ({ Label, name, value, change, error, ...props }) => {
    const [changed, setChanged] = useState(false);
    const inputRef = useRef();
    return (
        <div className="custom_input">
            <input
                className={`custom_input_input ${
                    error && changed ? 'custom_input_error' : changed ? 'custom_input_valid' : ''
                } ${value.length > 0 && 'custom_input_filled'}`}
                value={value}
                ref={inputRef}
                name={name}
                onChange={change}
                onClick={() => {
                    setChanged(true);
                }}
                {...props}
            />
            <label
                onClick={() => {
                    inputRef.current.focus();
                    setChanged(true);
                }}
                className="custom_input_label"
                htmlFor={name}
            >
                {Label}
            </label>
        </div>
    );
};

export default Index;
