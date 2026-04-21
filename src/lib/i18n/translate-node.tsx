import * as React from "react";

export function translateNode(
  node: React.ReactNode,
  translateText: (text: string) => string,
): React.ReactNode {
  if (typeof node === "string") {
    return translateText(node);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {translateNode(child, translateText)}
      </React.Fragment>
    ));
  }

  if (!React.isValidElement(node)) {
    return node;
  }

  const element = node as React.ReactElement<{
    children?: React.ReactNode;
    "aria-label"?: string;
    placeholder?: string;
    title?: string;
  }>;
  const nextProps: {
    children?: React.ReactNode;
    "aria-label"?: string;
    placeholder?: string;
    title?: string;
  } = {};

  if (element.props.children !== undefined) {
    nextProps.children = translateNode(element.props.children, translateText);
  }

  if (typeof element.props["aria-label"] === "string") {
    nextProps["aria-label"] = translateText(element.props["aria-label"]);
  }

  if (typeof element.props.placeholder === "string") {
    nextProps.placeholder = translateText(element.props.placeholder);
  }

  if (typeof element.props.title === "string") {
    nextProps.title = translateText(element.props.title);
  }

  return React.cloneElement(element, nextProps);
}