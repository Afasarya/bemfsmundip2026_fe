"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, ImagePlus,
} from "lucide-react";
import { useState } from "react";

export type ArticleEditorToolbarProps = {
  editor: Editor | null;
  onInsertImage: () => void;
};

const tbBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white";
const tbBtnActive = "bg-bara-orange/15 text-bara-orange hover:bg-bara-orange/25";

// Tiptap v3 StarterKit exposes many commands at runtime (toggleUnderline,
// toggleStrike, toggleHeading, toggleBulletList, toggleOrderedList,
// toggleBlockquote, setTextAlign, …) but the `ChainedCommands` type does not
// surface them through StarterKit's bundled-extension inference. Cast to any
// locally for chain calls so the toolbar stays type-safe at the public API.
type Chain = any;

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${tbBtn} ${active ? tbBtnActive : ""} disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

export default function ArticleEditorToolbar({ editor, onInsertImage }: ArticleEditorToolbarProps) {
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return <div className="h-10" />;

  const chain = () => editor.chain().focus() as Chain;

  const setLink = () => {
    if (!linkUrl) {
      chain().unsetLink().run();
    } else {
      const safe = linkUrl.match(/^(https?:|mailto:)/i) ? linkUrl : `https://${linkUrl}`;
      chain()
        .extendMarkRange("link")
        .setLink({ href: safe, target: "_blank", rel: "noopener noreferrer" })
        .run();
    }
    setShowLink(false);
    setLinkUrl("");
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border border-b-0 border-white/[0.07] bg-[#16130f] px-3 py-2">
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => chain().toggleBold().run()}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => chain().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => chain().toggleUnderline().run()}
        title="Underline"
      >
        <Underline className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => chain().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => chain().toggleBulletList().run()}
        title="Bullet list"
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => chain().toggleOrderedList().run()}
        title="Numbered list"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => chain().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => chain().setTextAlign("left").run()}
        title="Align left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => chain().setTextAlign("center").run()}
        title="Align center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => chain().setTextAlign("right").run()}
        title="Align right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-white/10" />

      <div className="relative">
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const existing = editor.getAttributes("link").href as string | undefined;
            setLinkUrl(existing ?? "");
            setShowLink(true);
          }}
          title="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        {showLink && (
          <div className="absolute left-0 top-full z-20 mt-2 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#1a1614] p-2 shadow-xl">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="admin-input h-8 w-56 text-xs"
              autoFocus
            />
            <button onClick={setLink} className="admin-primary-button h-8 px-3 text-xs">
              Terapkan
            </button>
            <button
              onClick={() => {
                setShowLink(false);
                setLinkUrl("");
              }}
              className="admin-secondary-button h-8 px-3 text-xs"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      <ToolbarButton onClick={onInsertImage} title="Sisipkan gambar">
        <ImagePlus className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}