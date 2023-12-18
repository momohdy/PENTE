const whiteStone = `
<svg height="15" width="15">
    <defs>
        <filter id="shadow">
        <feDropShadow
            dx="0.7"
            dy="0.7"
            stdDeviation="0.35"
            flood-color="#434A50"
        ></feDropShadow>
        </filter>
        <radialGradient id="white-stone-gradient" cx="40%" cy="40%" r="50%">
        <stop offset="0%" stop-color="var(--color1)"></stop>
        <stop offset="100%" stop-color="var(--color2)"></stop>
        </radialGradient>
    </defs>
    <circle
        cx="5"
        cy="5"
        r="5"
        fill="url(#white-stone-gradient)"
        pointer-events="none"
        filter="url(#shadow)"
    ></circle>
</svg>
`;

const blackStone = `
<svg height="15" width="15">
    <defs>
        <filter id="shadow">
        <feDropShadow
            dx="0.7"
            dy="0.7"
            stdDeviation="0.35"
            flood-color="#434A50"
        ></feDropShadow>
        </filter>
        <radialGradient id="black-stone-gradient" cx="40%" cy="40%" r="50%">
        <stop offset="0%" stop-color="var(--color1)"></stop>
        <stop offset="100%" stop-color="var(--color2)"></stop>
        </radialGradient>
    </defs>
    <circle
        cx="5"
        cy="5"
        r="5"
        fill="url(#black-stone-gradient)"
        pointer-events="none"
        filter="url(#shadow)"
    ></circle>
</svg>
`;

export { whiteStone, blackStone };
