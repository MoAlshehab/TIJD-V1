import React from 'react';

export default function SearchInput({
    value,
    onChange,
    placeholder = '',
    name = 'search',
    className = '',
}) {
    return (
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`shadow appearance-none border border-gray-light dark:border-dark-text rounded w-full py-2 px-3 bg-light dark:bg-dark-surface text-dark dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline ${className}`}
        />
    );
}
