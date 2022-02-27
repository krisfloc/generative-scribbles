import { getGlobalParameters } from "../parameters";

let y0, x1, y1, x2, y2;

const drawSineWave = (buffer, width, height, modifier, color) => {
    for (let i = 0; i <= width; i++) {
        y0[i] = height / 2;

        if (i === 0) {
            y1[i] = y0;
            x1[i] = 0 + modifier;
        } else {
            y1[i] = y1[i - 1];
            x1[i] = x1[i - 1];
        }

        buffer.stroke(
            `rgba(0, 0, 0, ${((1 / 450) * (width - x1[i] / 2)) / 5})`
        );
        const amplitude = (i / 10) * (modifier / 60);

        x2[i] = x1[i] + 1;
        y2[i] = amplitude * buffer.sin(i / 10) + y0[i];

        buffer.line(x1[i], y1[i], x2[i], y2[i]);

        x1[i] = x2[i];
        y1[i] = y2[i];
    }
};

const sketch = (p) => {
    let {
        printSize,
        scaleRatio,
        exportRatio,
        palette,
        sinusAmount,
    } = getGlobalParameters();
    let buffer;
    let canvas;
    let printingSize = printSize ?? {
        width: 3508,
        height: 2480,
    };
    //No guarantee these values are set.
    //Background is a string with hex value
    //Colors is an array of strings with hex value
    //Stroke is a hex value
    //Size is an integer
    //https://kgolid.github.io/chromotome-site/
    let { background, colors, stroke, size } = palette;
    //Setting background to a default white if no background exists.
    background = background ? background : "#FFF";

    p.setup = () => {
        let w = printingSize.width / exportRatio;
        let h = printingSize.height / exportRatio;
        buffer = p.createGraphics(w, h);
        canvas = p.createCanvas(w, h);
        // Adjust according to screens pixel density.
        exportRatio /= p.pixelDensity();
        //Do your setup here ⬇️
        p.angleMode(p.RADIANS);
        p.noLoop();

        y0 = [];
        x1 = [];
        y1 = [];
        x2 = [];
        y2 = [];
    };

    p.draw = () => {
        // Clear buffer each frame
        buffer.clear();
        // Transform (scale) all the drawings
        buffer.scale(scaleRatio);
        buffer.background(background);

        //Draw here :) ⬇️

        for (let modifier = 1; modifier < sinusAmount; modifier++) {
            drawSineWave(buffer, p.width, p.height, modifier);
        }

        //Stop drawing here ⬆️
        // Draw buffer to canvas
        p.image(buffer, 0, 0);
    };

    const exportHighResolution = () => {
        scaleRatio = exportRatio;
        // Re-create buffer with exportRatio and re-draw
        buffer = p.createGraphics(scaleRatio * p.width, scaleRatio * p.height);
        p.draw();
        // Get timestamp to name the ouput file
        let timestamp = new Date().getTime();
        // Save as PNG
        p.save(buffer, p.str(`${name}-${timestamp}`), "png");
        // Reset scaleRation back to original, re-create buffer, re-draw
        scaleRatio = 1;
        buffer = p.createGraphics(p.width, p.height);
        p.draw();
    };

    p.keyReleased = () => {
        if (p.key == "e" || p.key == "E") {
            exportHighResolution();
        }
    };
};

const name = "Sinus Wave2";
const parameters = { sinusAmount: 50 };

const addFolder = (gui) => {
    const folder = gui.addFolder("Sinus Wave");
    folder.add(parameters, "sinusAmount", 10, 400, 5);
    return folder;
};

export { name, sketch, addFolder, parameters };
