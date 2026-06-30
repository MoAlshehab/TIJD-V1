import React from 'react';
const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    danger: 'bg-danger text-white hover:bg-danger/90',
    success: 'bg-success text-white hover:bg-success/90',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
};

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    loading = false,
    onClick,
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2
                px-4 py-2 rounded-2xl shadow-sm
                text-sm font-medium transition
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantClasses[variant] || variantClasses.primary}
                ${className}
            `}
            {...props}
        >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            {children}
        </button>
    );
}
