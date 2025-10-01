import {JBDictionary} from 'jb-core/i18n';
export type JBSelectDictionary = {
  requireMessage:(label:string|null)=>string,
}

/**
 * dictionary of jb select input. it's already loaded with persian and english lang but you can also extend it with you apps other language or replace already exist language 
 * @example 
 * ```js
 * import {dictionary} from 'jb-select-input'
 * dictionary.setLanguage("fr", {
 *  requireMessage: (label:string| null)=>`${label} french require message`,
 * // other dictionary keys
 * });
 * ```
 */
export const dictionary = new JBDictionary<JBSelectDictionary>({
  "fa":{
    requireMessage:(label:string| null)=>`${label} حتما باید انتخاب شود`,
  },
  "en":{
    requireMessage:(label:string| null)=>`${label} is required`,
  }
});