import { modifier } from 'ember-modifier';
import ClipboardJS from 'clipboard';
import { isBlank } from '@ember/utils';
import { guidFor } from '@ember/object/internals';

const CLIPBOARD_EVENTS = ['success', 'error'] as const;

type ClipboardEventName = (typeof CLIPBOARD_EVENTS)[number];
type ClipboardEventHandler = (event: ClipboardJS.Event) => unknown;

interface ClipboardSignature {
  Element: HTMLElement;
  Args: {
    Named: {
      /**
       * Whether to copy or cut the text. Defaults to `copy`.
       */
      action?: 'copy' | 'cut';
      /**
       * The element (or a selector for it) that ClipboardJS focuses while copying, for use in
       * modals that trap focus.
       */
      container?: string | Element;
      /**
       * `true` scopes the click listener to this element; `false` scopes it to `document.body`,
       * which is ClipboardJS's default.
       */
      delegateClickEvent?: boolean;
      /**
       * A selector for the element whose content is copied.
       */
      target?: string;
      /**
       * The text to copy, or a function that returns it.
       */
      text?: string | null | ((element: Element) => string);
      /**
       * Called after the text is copied.
       */
      onSuccess?: ClipboardEventHandler;
      /**
       * Called if the copy fails.
       */
      onError?: ClipboardEventHandler;
    };
  };
}

function capitalize<T extends string>(string: T) {
  return (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>;
}

const clipboardModifier = modifier<ClipboardSignature>((element, _params, hash) => {
  const {
    action = 'copy',
    container,
    /*
     * delegateClickEvent true - scope event listener to this element
     * delegateClickEvent false - scope event listener to document.body (ClipboardJS)
     */
    delegateClickEvent = true,
    target,
    text,
  } = hash;

  element.setAttribute('data-clipboard-action', action);

  if (typeof text === 'string' && !isBlank(text)) {
    element.setAttribute('data-clipboard-text', text);
  }
  if (target && !isBlank(target)) {
    element.setAttribute('data-clipboard-target', target);
  }

  if (isBlank(element.dataset['clipboardId'])) {
    element.setAttribute('data-clipboard-id', guidFor(element));
  }

  const trigger =
    delegateClickEvent === false
      ? element
      : `[data-clipboard-id=${element.dataset['clipboardId']}]`;

  const clipboard = new ClipboardJS(trigger, {
    text: typeof text === 'function' ? text : undefined,
    container:
      typeof container === 'string' ? (document.querySelector(container) ?? undefined) : container,
  });

  CLIPBOARD_EVENTS.forEach((event: ClipboardEventName) => {
    clipboard.on(event, (clipboardEvent: ClipboardJS.Event) => {
      if (!(element as HTMLButtonElement).disabled) {
        const handler = hash[`on${capitalize(event)}`];
        handler?.(clipboardEvent);
      }
    });
  });

  return () => clipboard.destroy();
});

export default clipboardModifier;
