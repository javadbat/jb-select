/* eslint-disable react/display-name */
import React, { useEffect, useRef, useImperativeHandle } from 'react';
// eslint-disable-next-line no-duplicate-imports
import {JBOptionListWebComponent } from 'jb-select';
type TOption = any;
type TValue = any;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'jb-option-list': JBOptionListType;
      }
      interface JBOptionListType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionListWebComponent<TOption,TValue>>, JBOptionListWebComponent<TOption,TValue>> {
        class?:string,
        // ref:React.RefObject<JBDateInputWebComponent>,
      }
    }
}
export const JBOptionList = React.forwardRef((props:JBOptionListProps, ref) => {
  const element = useRef<JBOptionListWebComponent<TOption,TValue>>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  useEffect(()=>{
    if(element.current && Array.isArray(props.optionList)){
      element.current.optionList = props.optionList;
    }
  },[props.optionList, element]);
  return (
    <jb-option-list ref={element}>
    </jb-option-list>
  );
});

export type JBOptionListProps = {
  optionList: TOption[];
}
JBOptionList.displayName = 'JBOptionList';