import { Selection } from 'prosemirror-state';
import { Message } from 'ai/react';
import { ProseMirrorRenderer } from '../../renderer-prosemirror';

export function insertMessages(
  pm: ProseMirrorRenderer,
  messages: Message[],
  selection: Selection | null
) {
  const markdown = messagesToMarkdown(messages);

  pm.chain()
    .focus()
    .insertMarkdownAt(selection || pm.state.selection, markdown)
    .run();
}

export function messagesToMarkdown(messages: Message[]) {
  return messages
    .map(message => {
      if (message.role === 'assistant') {
        return message.content;
      }

      return `**Q: ${message.content}**`;
    })
    .join('\n\n');
}
