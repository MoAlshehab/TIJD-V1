const DropdownToggleButton = ({ isOpen, onClick, icon = '📂', label = 'Options' }) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow"
        >
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold">{label}</span>
            </div>
            <span className="text-lg">{isOpen ? '▲' : '▼'}</span>
        </button>
    );
};

export default DropdownToggleButton;
