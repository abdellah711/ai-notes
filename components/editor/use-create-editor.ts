"use client";

import { withProps } from "@udecode/cn";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import {
  ParagraphPlugin,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
} from "@udecode/plate/react";
import { editorPlugins } from "./plugins";
import { CodeLeaf } from "../plate-ui/code-leaf";

export const useCreateEditor = () => {
  return usePlateEditor({
    override: {
      components: {
        [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
        [ParagraphPlugin.key]: withProps(PlateElement, {
          as: "p",
          className: "mb-4",
        }),
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
        blockquote: withProps(PlateElement, {
          as: "blockquote",
          className:
            "mb-4 border-l-4 border-content3 pl-4 text-content3-foreground",
        }),
        h1: withProps(PlateElement, {
          as: "h1",
          className:
            "mb-4 mt-6 text-3xl font-semibold tracking-tight lg:text-4xl",
        }),
        h2: withProps(PlateElement, {
          as: "h2",
          className: "mb-4 mt-6 text-2xl font-semibold tracking-tight",
        }),
        h3: withProps(PlateElement, {
          as: "h3",
          className: "mb-4 mt-6 text-xl font-semibold tracking-tight",
        }),
        h4: withProps(PlateElement, {
          as: "h4",
          className: "mb-4 mt-6 text-lg font-semibold tracking-tight",
        }),
        h5: withProps(PlateElement, {
          as: "h5",
          className: "mb-4 mt-6 text-lg font-semibold tracking-tight",
        }),
        h6: withProps(PlateElement, {
          as: "h6",
          className: "mb-4 mt-6 text-lg font-semibold tracking-tight",
        }),
        [CodePlugin.key]: CodeLeaf,
      },
    },
    plugins: [...editorPlugins],
    value: [
      {
        children: [{ text: "Basic Editor" }],
        type: "h1",
      },
      {
        children: [{ text: "Heading 2" }],
        type: "h2",
      },
      {
        children: [{ text: "Heading 3" }],
        type: "h3",
      },
      {
        children: [{ text: "This is a blockquote element" }],
        type: "blockquote",
      },
      {
        children: [
          { text: "Basic marks:" },
          { bold: true, text: "bold" },
          { text: "," },
          { italic: true, text: "italic" },
          { text: "," },
          { text: "underline", underline: true },
          { text: "," },
          { strikethrough: true, text: "strikethrough" },
          { text: "." },
        ],
        type: ParagraphPlugin.key,
      },
    ],
  });
};
