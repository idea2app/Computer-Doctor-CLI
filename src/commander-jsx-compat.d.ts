import type { Command as CLICommand, CommandChildren, CommandMeta } from 'commander-jsx/dist/Command';

declare global {
  namespace JSX {
    interface Element extends CLICommand<any> {}

    interface ElementAttributesProperty {
      options: unknown;
    }

    interface IntrinsicAttributes {
      children?: CommandChildren;
    }

    interface IntrinsicElements {
      [elemName: string]: unknown;
    }

    interface ElementChildrenAttribute {
      children: unknown;
    }

    interface ElementType<T = any> {
      new (meta: CommandMeta<T>): CLICommand<T>;
    }
  }
}

export {};
