import React from 'react';
import { ArrowRight } from 'lucide-react'; // Je kunt ook een andere pijl gebruiken

const colorVariants = {
    green: {
        base: 'bg-green-600 hover:bg-green-700',
        selected: 'bg-green-700',
        darkBase: 'dark:bg-green-700 dark:hover:bg-green-800',
        darkSelected: 'dark:bg-green-500 text-gray-900',
    },
    blue: {
        base: 'bg-blue-600 hover:bg-blue-700',
        selected: 'bg-blue-700',
        darkBase: 'dark:bg-blue-700 dark:hover:bg-blue-800',
        darkSelected: 'dark:bg-blue-500 text-gray-900',
    },
    // voeg hier meer kleuren toe indien nodig
};

export default function SelectableCard({
    id,
    selectedId,
    onSelect,
    disabled = false,
    title,
    details = [],
    image = null,
    lightColor = 'green',
    darkColor = 'green',
}) {
    const isSelected = selectedId === id;
    const variants = colorVariants[lightColor] || colorVariants.green;
    const darkVariants = colorVariants[darkColor] || colorVariants.green;

    return (
        <button
            onClick={() => !disabled && onSelect(id)}
            disabled={disabled}
            className={`
                group w-full p-4 sm:p-6 rounded-2xl shadow-md text-left flex justify-between items-center gap-4
                transition-colors duration-200
                ${isSelected ? variants.selected : variants.base}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${isSelected ? darkVariants.darkSelected : darkVariants.darkBase}
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-${lightColor}-700
            `}
        >
            <div className="flex items-center gap-4">
                {/* {image && (
                    <img
                        src={image}
                        onError={(e) => {
                            e.currentTarget.src = '/images/default_profile.jpg';
                        }}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                )} */}

            <img
                src={image || '/storage/default_profile.webp'}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/storage/default_profile.webp';
                }}
                alt={title}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
                                <div>
                    <div className="font-bold text-lg sm:text-xl">{title}</div>
                    {details.map((line, index) => (
                        <div key={index} className="text-sm sm:text-base opacity-90">
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rechter pijl */}
            <ArrowRight
                className="text-white group-hover:translate-x-1 transition-transform duration-200"
                size={24}
            />
        </button>
    );
}
