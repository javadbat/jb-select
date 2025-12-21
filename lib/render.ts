export function renderHTML(): string {
  return /* html */ `
  <div class="jb-select-web-component">
    <div class="label-wrapper">
        <label class="--hide"><span class="label-value"></span></label>
        <!-- close button will be visible on mobile modal -->
        <div class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path class="close-btn-svg-bg" opacity="0.4"
                    d="M16.3399 1.9998H7.66988C4.27988 1.9998 1.99988 4.3798 1.99988 7.9198V16.0898C1.99988 19.6198 4.27988 21.9998 7.66988 21.9998H16.3399C19.7299 21.9998 21.9999 19.6198 21.9999 16.0898V7.9198C21.9999 4.3798 19.7299 1.9998 16.3399 1.9998Z" />
                <path class="close-btn-svg-path"
                    d="M15.0156 13.7703L13.2366 11.9923L15.0146 10.2143C15.3566 9.8733 15.3566 9.3183 15.0146 8.9773C14.6726 8.6333 14.1196 8.6343 13.7776 8.9763L11.9986 10.7543L10.2196 8.9743C9.87758 8.6323 9.32358 8.6343 8.98158 8.9743C8.64058 9.3163 8.64058 9.8713 8.98158 10.2123L10.7616 11.9923L8.98558 13.7673C8.64358 14.1093 8.64358 14.6643 8.98558 15.0043C9.15658 15.1763 9.37958 15.2613 9.60358 15.2613C9.82858 15.2613 10.0516 15.1763 10.2226 15.0053L11.9986 13.2293L13.7786 15.0083C13.9496 15.1793 14.1726 15.2643 14.3966 15.2643C14.6206 15.2643 14.8446 15.1783 15.0156 15.0083C15.3576 14.6663 15.3576 14.1123 15.0156 13.7703Z"
                    fill="#200E32" />
            </svg>
        </div>
    </div>
    <div class="select-box">
        <div class="start-section">
            <slot name="start-section"></slot>
        </div>
        <div class="middle-section">
            <div class="selected-value-wrapper"></div>
            <div class="front-box">
                <input class="input" />

            </div>
        </div>
        <div class="end-section">
            <div class="arrow-icon" tabindex="-1">
                <slot name="select-arrow-icon">
                    <svg width='8' height='8' id='Layer_1' x='0px' y='0px' viewBox='0 0 494.1 371.1'
                        style='enable-background:new 0 0 494.1 371.1;' xml:space='preserve'>
                        <path
                            d='M293,343.8L480.9,69.3c8.7-12.7,13.3-25.4,13.3-36.1c0-20.5-16.5-33.2-44-33.2H44C16.4,0,0,12.7,0,33.2  c0,10.6,4.6,23.2,13.3,35.9l187.9,274.6c12.1,17.7,28.4,27.4,45.9,27.4C264.6,371.1,280.9,361.4,293,343.8z' />
                    </svg>
                </slot>
            </div>
        </div>
    </div>
    <div class="middle-divider">
        <!-- middle line between input box and list (hidden by default but user may need it sometimes) -->
    </div>
    <div class="select-list-wrapper">
        <div class="select-list" tabindex="-1" role="listbox">
            <slot></slot>
        </div>
        <div class="empty-list-placeholder">
            <slot name="empty-list-message">no item available</slot>
        </div>
    </div>
    <div class="message-box"></div>
  </div>
  `;
}