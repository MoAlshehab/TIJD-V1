import React from 'react';

export default function ToggleSwitch({
    checked = false,
    onChange = () => {},
    labelOn = 'On',
    labelOff = 'Off',
    className = '',
}) {
    return (
        <div className={`flex items-center ml-auto space-x-2 ${className}`}>
            <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
                <div
                    className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ${
                        checked ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                            checked ? 'translate-x-4' : 'translate-x-0'
                        }`}
                    ></div>
                </div>
            </label>
            <span className={`text-sm font-medium ${checked ? 'text-green-500' : 'text-gray-500'}`}>
                {checked ? labelOn : labelOff}
            </span>
        </div>
    );
}
