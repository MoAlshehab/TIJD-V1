import React from 'react';

export default function InputField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    className = '',
}) {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-gray-700 dark:text-gray-300 mb-1 font-medium"
                >
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${className}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
