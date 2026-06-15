// resources/js/components/FooterLink.jsx

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FooterLink({ href, icon, label, badge }) {
    const { url } = usePage();
    const isActive = url === href;

    return (
        <Link
            href={href}
            className={`flex flex-col items-center relative
                ${isActive ? 'text-blue-400 font-semibold' : 'text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-400'}
            `}
        >
            <FontAwesomeIcon icon={icon} size="2x" />
            <span className="text-xs">{label}</span>

            {badge !== undefined && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {badge}
                </span>
            )}
        </Link>
    );
}

export default FooterLink;
