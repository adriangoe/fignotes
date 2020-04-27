// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
let colorMap = new Map();
colorMap.set("blue", { r: 0.427, g: 0.741, b: 0.917 });
colorMap.set("red", { r: 1, g: 0.466, b: 0.466 });
colorMap.set("green", { r: 0.482, g: 0.863, b: 0.725 });
colorMap.set("yellow", { r: 1, g: 0.729, b: 0.321 });
colorMap.set("purple", { r: 0.651, g: 0.502, b: 0.973 });
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// figma.loadFontAsync({ family: "Roboto", style: "Regular" });
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const frame = figma.createFrame();
            const title = figma.createText();
            const name = figma.createText();
            frame.verticalPadding = 16;
            frame.horizontalPadding = 16;
            title.resize(120, 100);
            name.resize(120, 20);
            title.fontSize = 20;
            name.fontSize = 10;
            frame.layoutMode = "VERTICAL";
            frame.counterAxisSizingMode = "AUTO";
            title.characters = "Insights";
            name.characters = "Name";
            name.textCase = "TITLE";
            frame.x = i * 166;
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
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
});
figma.on('selectionchange', () => {
    for (let i = 0; i < figma.currentPage.selection.length; i++) {
        const node = figma.currentPage.selection[0];
        if (node.type == "FRAME") {
            figma.currentPage.appendChild(node);
        }
    }
});
