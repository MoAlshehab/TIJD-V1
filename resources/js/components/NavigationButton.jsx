import { router } from '@inertiajs/react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavigationButton = ({
    to,
    icon,
    label,
    bgColor = 'bg-primary',
    hoverColor = 'hover:bg-primaryDark',
    textColor = 'text-light',
}) => {
    const handleClick = () => {
        router.get(to);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${bgColor} ${textColor} ${hoverColor} transition shadow dark:text-white`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold">{label}</span>
            </div>

            <FontAwesomeIcon icon={faArrowRight} className="text-2xl" />
        </button>
    );
};

export default NavigationButton;
