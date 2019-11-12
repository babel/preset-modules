import esutils from "esutils";

/**
 * Converts JSX Spread arguments into Object Spread, avoiding Babel's helper or Object.assign injection.
 * Input:
 * 	 <div a="1" {...b} />
 * Output:
 *   <div {...{ a: "1", ...b }} />
 * ...which Babel converts to:
 *   h("div", { a: "1", ...b })
 */
export default ({ types: t }) => {
  function convertAttribute(node) {
    if (t.isJSXSpreadAttribute(node)) {
      return t.spreadElement(node.argument);
    }

    let value = node.value || t.booleanLiteral(true);

    if (t.isJSXExpressionContainer(value)) {
      value = value.expression;
    } else if (t.isStringLiteral(value)) {
      value.value = value.value.replace(/\n\s+/g, " ");

      // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
      if (value.extra && value.extra.raw) {
        delete value.extra.raw;
      }
    }

    if (t.isJSXNamespacedName(node.name)) {
      node.name = t.stringLiteral(
        node.name.namespace.name + ":" + node.name.name.name
      );
    } else if (esutils.keyword.isIdentifierNameES6(node.name.name)) {
      node.name.type = "Identifier";
    } else {
      node.name = t.stringLiteral(node.name.name);
    }

    return t.inherits(t.objectProperty(node.name, value), node);
  }

  return {
    name: "transform-hoist-tagged-templates",
    visitor: {
      JSXOpeningElement(path) {
        const hasSpread = path.node.attributes.some(t.isJSXSpreadAttribute);

        // ignore JSX Elements without spread or with lone spread:
        if (!hasSpread || path.node.attributes.length === 1) return;

        path.node.attributes = [
          t.jsxSpreadAttribute(
            t.objectExpression(path.node.attributes.map(convertAttribute))
          ),
        ];
      },
    },
  };
};
