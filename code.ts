// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

let colorMap = new Map();
colorMap.set("blue", {r: 0.427, g: 0.741, b: 0.917});
colorMap.set("red", {r: 1, g: 0.466, b: 0.466});
colorMap.set("green", {r: 0.482, g: 0.863, b: 0.725});
colorMap.set("yellow", {r: 1, g: 0.729, b: 0.321});
colorMap.set("purple", {r: 0.651, g: 0.502, b: 0.973});

// This shows the HTML page in "ui.html".
const uiOptions = <ShowUIOptions> {
  visible: true,
  width: 300,
  height: 275
}
figma.showUI(__html__, uiOptions);
// figma.loadFontAsync({ family: "Roboto", style: "Regular" });

function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

let row = 0;

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" })

  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];

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

      frame.x = i * 166;
      frame.y = row * 166;
      frame.fills = [{type: 'SOLID', color: colorMap.get(msg.color)}];
      frame.appendChild(title);
      frame.appendChild(name);
      const effects = clone(frame.effects);
      const shadow = <ShadowEffect> {
        type: "DROP_SHADOW",
        color: {r:0, g:0, b:0, a:.25},
        blendMode: "NORMAL",
        offset: {x:0, y:0},
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
    row += 1;
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

figma.on('selectionchange', () => {
   for (let i = 0; i < figma.currentPage.selection.length; i++) {
     const node = figma.currentPage.selection[0];
     if (node.name == "Fignote") {
       figma.currentPage.appendChild(node);
     }
   }
});
