"use client";
// import emojiMartData from "@emoji-mart/data";
import { DatePlugin } from "@udecode/plate-date/react";
// import { EmojiPlugin } from "@udecode/plate-emoji/react";
import { ColumnPlugin } from "@udecode/plate-layout/react";
import { SlashPlugin } from "@udecode/plate-slash-command/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { createPlatePlugin, ParagraphPlugin } from "@udecode/plate/react";
import { BasicMarksPlugin } from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { CodeBlockPlugin } from "@udecode/plate-code-block/react";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { TodoListPlugin } from "@udecode/plate-list/react";
import { ListPlugin } from "@udecode/plate-list/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";

//@ts-ignore
import Prism from "prismjs";

import { ResetNodePlugin } from "@udecode/plate-reset-node/react";

const resetBlockTypesCodeBlockRule = {
  types: [CodeBlockPlugin.key],
  defaultType: ParagraphPlugin.key,
  onReset: unwrapCodeBlock,
};

import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import {
  isCodeBlockEmpty,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
} from "@udecode/plate-code-block";
import { autoformatPlugin } from "./autoformat-plugin";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import { HEADING_LEVELS } from "@udecode/plate-heading";
import { TrailingBlockPlugin } from "@udecode/plate-trailing-block";

export const basicNodesPlugins = [
  HeadingPlugin.configure({ options: { levels: 6 } }),
  BlockquotePlugin,
  CodeBlockPlugin.configure({
    options: {
      prism: Prism,
    },
  }),
  BasicMarksPlugin,
] as const;

export const FloatingToolbarPlugin = createPlatePlugin({
  key: "floating-toolbar",
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    ),
  },
});

const resetBlockTypesCommonRule = {
  defaultType: ParagraphPlugin.key,
  types: [
    ...HEADING_LEVELS,
    BlockquotePlugin.key,
    INDENT_LIST_KEYS.todo,
    ListStyleType.Disc,
    ListStyleType.Decimal,
  ],
};

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  DatePlugin,
  TogglePlugin,
  ColumnPlugin,
  // Block Style
  ListPlugin,
  TodoListPlugin,
] as const;

export const editorPlugins = [
  // Nodes
  ...viewPlugins,
  // Functionality
  SlashPlugin,
  autoformatPlugin,
  ResetNodePlugin.configure({
    options: {
      rules: [
        {
          ...resetBlockTypesCommonRule,
          hotkey: "Enter",
          predicate: (editor) =>
            editor.api.isEmpty(editor.selection, { block: true }),
        },
        {
          ...resetBlockTypesCodeBlockRule,
          hotkey: "Enter",
          predicate: isCodeBlockEmpty,
        },
        {
          ...resetBlockTypesCodeBlockRule,
          hotkey: "Backspace",
          predicate: isSelectionAtCodeBlockStart,
        },
      ],
    },
  }),
  TrailingBlockPlugin,
  NodeIdPlugin,
  // DndPlugin.configure({
  //   options: {
  //     enableScroller: true,
  //     onDropFiles: ({ dragItem, editor, target }) => {
  //       editor
  //         .getTransforms(PlaceholderPlugin)
  //         .insert.media(dragItem.files, { at: target, nextBlock: false });
  //     },
  //   },
  //   render: {
  //     aboveNodes: DraggableAboveNodes,
  //   },
  // }),
  // //   EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
  // Deserialization
  MarkdownPlugin.configure({ options: { indentList: true } }),
  // UI
  FloatingToolbarPlugin,
];
