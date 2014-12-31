// Takes a well-formed HTML string and converts it to the IR for the compiler
function parseHTML(htmlString) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(htmlString, "application/xml");
  if (doc.childElementCount !== 1) {
    throw new Error("HTML must have exactly one root element");
  }

  var root = doc.firstElementChild;
  window.root = root;
  return getIRForNode(root);
}

function getIRForNode(node) {
  var ir = {};
  if (node.nodeType === document.TEXT_NODE) {
    ir.type = "text";
    ir.text = node.data;
  } else if (node.nodeType === document.ELEMENT_NODE) {
    ir.type = "tag";
    ir.tagName = node.tagName;
    if (node.attributes && node.attributes.length > 0) {
      ir.attributes = {};
      for (var i = 0; i < node.attributes.length; ++i) {
        ir.attributes[node.attributes[i].name] = node.attributes[i].value;
      }
    }
    if (node.childNodes && node.childNodes.length > 0) {
      ir.children = [];
      for (var i = 0; i < node.childNodes.length; ++i) {
        ir.children.push(getIRForNode(node.childNodes[i]));
      }
    }
  } else {
    throw new Error("Unknown node type: " + node.nodeType);
  }

  return ir;
}
