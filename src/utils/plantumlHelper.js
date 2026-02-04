import plantumlEncoder from 'plantuml-encoder';

/**
 * Encodes PlantUML script into a string suitable for the PlantUML server.
 * @param {string} puml - The PlantUML script to encode.
 * @returns {string} The encoded string.
 */
export const encodePuml = (puml) => {
    return plantumlEncoder.encode(puml);
};

/**
 * Generates the SVG URL for a given PlantUML script.
 * @param {string} puml - The PlantUML script.
 * @returns {string} The SVG URL.
 */
export const getSvgUrl = (puml) => {
    const encoded = encodePuml(puml);
    return `https://www.plantuml.com/plantuml/svg/${encoded}`;
};
