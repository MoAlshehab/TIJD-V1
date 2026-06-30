import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ActionButton = ({
    onClick,
    icon,
    label,
    bgColor = 'bg-primary',
    hoverColor = 'hover:bg-primaryDark',
    textColor = 'text-light',
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${bgColor} ${textColor} ${hoverColor} transition shadow`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold">{label}</span>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </button>
    );
};

export default ActionButton;
