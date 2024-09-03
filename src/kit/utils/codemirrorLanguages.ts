import { json } from '@codemirror/lang-json';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { yaml } from '@codemirror/lang-yaml';
import { LanguageSupport } from '@codemirror/language';

export const langs = {
  json,
  markdown: (): LanguageSupport => markdown({ base: markdownLanguage }),
  python,
  yaml,
};
