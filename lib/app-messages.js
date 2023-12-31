import { getLocaleLang } from "@/lib/locales";

const name = 'David B';
export const siteTitle = `MuMind (${name}) personal website`;

const translationMap = {
  [siteTitle]: {
    es: `MuMind (${name}), sitio web personal`,
  },
  'Personal website with musings and portfolio stuff': {
    es: 'Sitio web personal con reflexiones y material de portafolio',
  },
  'I’m a software engineer and explorer.': {
    es: 'Soy ingeniero de software y explorador.',
  },
  'My projects': {
    es: 'Mis proyectos',
  },
  'Recent posts': {
    es: 'Entradas recientes',
  },
  'Back to home': {
    es: 'Regresar',
  },
  // Post titles
  'Revamped personal website': {
    es: 'Renové mi sitio web',
  },
  'Markdown Tailwind struggles': {
    es: 'Luchas con Markdown y Tailwind',
  },
};

export function t(message, locale) {
  // TODO: #7 - Tag returned strings with a fallback signal in fallback case?
  return translationMap[message]?.[getLocaleLang(locale)] ?? message;
}
