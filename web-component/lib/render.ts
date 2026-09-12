import { i18n } from "jb-core/i18n";
import { dictionary } from "./i18n";

export function renderHTML(): string {
    return /* html */ `
  <div class="jb-select-web-component">
    <label class="label-value"></label>
    <div class="select-box">
        <div class="inline-start">
            <slot name="inline-start"></slot>
        </div>
        <div class="middle-section">
            <div class="selected-value-wrapper" ></div>
            <div class="front-box" tabindex="0">
                <input class="search-input" part="search-input" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="option-list"/>
            </div>
        </div>
        <div class="inline-end">
        <button class="clear-button" part="clear-button" type="button" aria-label="${dictionary.get(i18n, "clearSelection")}" hidden>
            <jb-icon-close aria-hidden="true"></jb-icon-close>
        </button>
            <button class="arrow-icon" tabindex="-1" part="arrow-icon" type="button" aria-label="${dictionary.get(i18n, "toggleOptions")}" aria-expanded="false">
                <slot name="select-arrow-icon">
                    <svg width='8' height='8' id='Layer_1' x='0px' y='0px' viewBox='0 0 494.1 371.1' aria-hidden="true"
                        style='enable-background:new 0 0 494.1 371.1;' xml:space='preserve'>
                        <path
                            d='M293,343.8L480.9,69.3c8.7-12.7,13.3-25.4,13.3-36.1c0-20.5-16.5-33.2-44-33.2H44C16.4,0,0,12.7,0,33.2  c0,10.6,4.6,23.2,13.3,35.9l187.9,274.6c12.1,17.7,28.4,27.4,45.9,27.4C264.6,371.1,280.9,361.4,293,343.8z' />
                    </svg>
                </slot>
            </button>
        </div>
    </div>
    <div class="popover-wrapper">
        <jb-popover class="select-list-wrapper" part="popover" exportparts="content: popover-content">
            <div class="mobile-search-input-wrapper">
            <!-- Here we put search input in Mobile -->
            </div>
            <div id="option-list" class="select-list" tabindex="-1" role="listbox">
                <slot></slot>
            </div>
            <div class="empty-list-placeholder">
                <slot name="empty-list-message">${dictionary.get(i18n, "noItems")}</slot>
            </div>
        </jb-popover>
    </div>
    <div class="message-box" role="status" aria-live="polite" aria-atomic="true"></div>
  </div>
  `;
}
