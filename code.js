var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Define the color options.
let colorMap = new Map();
colorMap.set("blue", { r: 0.427, g: 0.741, b: 0.917 });
colorMap.set("red", { r: 1, g: 0.466, b: 0.466 });
colorMap.set("green", { r: 0.482, g: 0.863, b: 0.725 });
colorMap.set("yellow", { r: 1, g: 0.729, b: 0.321 });
colorMap.set("purple", { r: 0.651, g: 0.502, b: 0.973 });
// This shows the HTML page in "ui.html".
const uiOptions = {
    visible: true,
    width: 300,
    height: 275
};
figma.showUI(__html__, uiOptions);
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    yield figma.loadFontAsync({ family: "Roboto", style: "Bold" });
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const frame = figma.createFrame();
            const title = figma.createText();
            const name = figma.createText();
            frame.verticalPadding = 12;
            frame.horizontalPadding = 12;
            frame.layoutMode = "VERTICAL";
            frame.counterAxisSizingMode = "AUTO";
            frame.name = "Fignote";
            title.resize(120, 110);
            title.fontSize = 12;
            title.characters = "Insights";
            name.resize(120, 10);
            name.fontSize = 8;
            name.characters = msg.tag;
            name.textCase = "UPPER";
            name.fontName = { family: "Roboto", style: "Bold" };
            frame.x = figma.viewport.center.x + i * 166;
            frame.y = figma.viewport.center.y;
            frame.fills = [{ type: 'SOLID', color: colorMap.get(msg.color) }];
            frame.appendChild(title);
            frame.appendChild(name);
            const effects = clone(frame.effects);
            const shadow = {
                type: "DROP_SHADOW",
                color: { r: 0, g: 0, b: 0, a: .25 },
                blendMode: "NORMAL",
                offset: { x: 0, y: 0 },
                radius: 12,
                visible: true
            };
            effects.push(shadow);
            frame.effects = effects;
            figma.currentPage.appendChild(frame);
            nodes.push(frame);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
});
figma.on('selectionchange', () => {
    for (let i = 0; i < figma.currentPage.selection.length; i++) {
        const node = figma.currentPage.selection[0];
        if (node.name == "Fignote") {
            figma.currentPage.appendChild(node);
        }
    }
});
