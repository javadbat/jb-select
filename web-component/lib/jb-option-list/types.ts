export type OptionListCallbacks<TOption,TValue> = {
  getTitle?:(option:TOption)=>string,
  getValue?:(option:TOption)=>TValue
  getContentDOM?:((option:TOption) => HTMLElement);
}