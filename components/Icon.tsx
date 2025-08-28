
import React from 'react';

interface IconProps {
    name: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
    const icons: { [key: string]: JSX.Element } = {
        play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />,
        pause: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />,
        plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
        check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
        undo: <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />,
        soundOn: <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />,
        soundOff: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />,
        reset: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667-11.667l3.181 3.183m0 0l-3.181 3.183m0 0l3.181-3.183M3.183 5.979l3.181 3.183" />,
        autoResetOn: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
        autoResetOff: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
        settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.131-1.226l.768-.292c.41-.156.85-.156 1.26 0l.768.292c.571.224 1.04.684 1.13 1.226l.094.542c.065.37.065.758 0 1.128l-.094.542c-.09.542-.56 1.002-1.131 1.226l-.768.292c-.41.156-.85.156-1.26 0l-.768-.292c-.571-.224-1.04-.684-1.13-1.226l-.094-.542a3.734 3.734 0 010-1.128zM15.75 15.75c.09-.542.56-1.002 1.131-1.226l.768-.292c.41-.156.85-.156 1.26 0l.768.292c.571.224 1.04.684 1.13 1.226l.094.542c.065.37.065.758 0 1.128l-.094.542c-.09.542-.56 1.002-1.131 1.226l-.768.292c-.41.156-.85.156-1.26 0l-.768-.292c-.571-.224-1.04-.684-1.13-1.226l-.094-.542a3.734 3.734 0 010-1.128zM4.5 15.75c.09-.542.56-1.002 1.131-1.226l.768-.292c.41-.156.85-.156 1.26 0l.768.292c.571.224 1.04.684 1.13 1.226l.094.542c.065.37.065.758 0 1.128l-.094.542c-.09.542-.56 1.002-1.131 1.226l-.768.292c-.41.156-.85-.156-1.26 0l-.768-.292c-.571-.224-1.04-.684-1.13-1.226l-.094-.542a3.734 3.734 0 010-1.128z" />,
        calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h28.5" />,
        trash: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c-.265.03-.529.06-.793.092m14.333 0l-1.106-2.81a1.125 1.125 0 00-1.092-.87H8.04a1.125 1.125 0 00-1.092.87L5.844 5.79m14.456 0L13.75 2.25m-8.5 0L5.25 2.25m7.5 0l-1.25-1.5L9.5 2.25" />,
        x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
        chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
        chevronRight: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />,
    };

    const iconSvg = icons[name];

    if (!iconSvg) {
        return null;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            {iconSvg}
        </svg>
    );
};

export default Icon;
