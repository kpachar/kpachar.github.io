const fs = require('fs');
const path = require('path');

const forms = require('./data/forms.json');

const outputDir = path.join(__dirname, 'images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const attributePositions = {
    UR: { x: 150, y: 50 },
    UL: { x: 50, y: 50 },
    BR: { x: 150, y: 150 },
    BL: { x: 50, y: 150 },
};

function getShankha(x, y) {
    return `<g transform="translate(${x}, ${y}) scale(0.7)">
        <path d="M 0,0 C 10,0 10,10 0,10 C -10,10 -10,0 0,0 Z" stroke="black" fill="none"/>
        <path d="M 0,-5 C 15,-5 15,15 -5,15 C -20,15 -20,-5 0,-5 Z" stroke="black" fill="none"/>
    </g>`;
}

function getChakra(x, y) {
    return `<g transform="translate(${x}, ${y}) scale(0.5)">
        <circle cx="0" cy="0" r="10" stroke="black" fill="none"/>
        <line x1="-10" y1="0" x2="10" y2="0" stroke="black"/>
        <line x1="0" y1="-10" x2="0" y2="10" stroke="black"/>
        <line x1="-7" y1="-7" x2="7" y2="7" stroke="black"/>
        <line x1="-7" y1="7" x2="7" y2="-7" stroke="black"/>
    </g>`;
}

function getGada(x, y) {
    return `<g transform="translate(${x}, ${y}) scale(0.5)">
        <line x1="0" y1="-15" x2="0" y2="15" stroke="black" stroke-width="2"/>
        <circle cx="0" cy="-15" r="5" stroke="black" fill="black"/>
    </g>`;
}

function getPadma(x, y) {
    return `<g transform="translate(${x}, ${y}) scale(0.7)">
        <path d="M 0,0 C -10,-10 10,-10 0,0 C -10,10 10,10 0,0 Z" stroke="black" fill="none"/>
        <path d="M 0,-10 C -10,0 -5,10 0,0" stroke="black" fill="none"/>
        <path d="M 0,-10 C 10,0 5,10 0,0" stroke="black" fill="none"/>
    </g>`;
}

const labelPositions = {
    UR: { x: 150, y: 80 },
    UL: { x: 50, y: 80 },
    BR: { x: 150, y: 180 },
    BL: { x: 50, y: 180 },
}

forms.forEach(form => {
    const attributes = {
        shankha: { name: 'shankha', svg: getShankha },
        chakra: { name: 'chakra', svg: getChakra },
        gada: { name: 'gada', svg: getGada },
        padma: { name: 'padma', svg: getPadma },
    };

    let svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="198" height="198" fill="none" stroke="black" stroke-width="2"/>
`;

    // Retrieve the actual attributes for the current form to determine which SVG function to call
    const formAttributes = {
        shankha: form.shankha,
        chakra: form.chakra,
        gada: form.gada,
        padma: form.padma
    };

    // Iterate over the positions and draw the correct attribute
    for (const positionKey in attributePositions) {
        const { x, y } = attributePositions[positionKey];
        // Find which attribute corresponds to the current position
        if (formAttributes.shankha === positionKey) {
            svgContent += attributes.shankha.svg(x, y);
        } else if (formAttributes.chakra === positionKey) {
            svgContent += attributes.chakra.svg(x, y);
        } else if (formAttributes.gada === positionKey) {
            svgContent += attributes.gada.svg(x, y);
        } else if (formAttributes.padma === positionKey) {
            svgContent += attributes.padma.svg(x, y);
        }
    }

    let labels = '';

    for (const position in attributePositions) {
        if (form.shankha === position) {
            labels += `<text x="${labelPositions[position].x}" y="${labelPositions[position].y}" font-size="12" text-anchor="middle">Shankha</text>`;
        }
        if (form.chakra === position) {
            labels += `<text x="${labelPositions[position].x}" y="${labelPositions[position].y}" font-size="12" text-anchor="middle">Chakra</text>`;
        }
        if (form.gada === position) {
            labels += `<text x="${labelPositions[position].x}" y="${labelPositions[position].y}" font-size="12" text-anchor="middle">Gadaa</text>`;
        }
        if (form.padma === position) {
            labels += `<text x="${labelPositions[position].x}" y="${labelPositions[position].y}" font-size="12" text-anchor="middle">Padma</text>`;
        }
    }

    svgContent += labels;

    svgContent += `</svg>`;

    const fileName = `${form.name.toLowerCase().replace(/\s/g, '-')}.svg`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, svgContent.trim());
});

console.log(`Generated ${forms.length} improved SVG files in ${outputDir}`);
