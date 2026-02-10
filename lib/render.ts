export function renderHTML(): string {
    return /* html */ `
  <div class="jb-select-web-component">
    <div class="label-wrapper">
        <label class="--hide"><span class="label-value"></span></label>
    </div>
    <div class="select-box">
        <div class="start-section">
            <slot name="start-section"></slot>
        </div>
        <div class="middle-section">
            <div class="selected-value-wrapper"></div>
            <div class="front-box">
                <input class="search-input" />
            </div>
        </div>
        <div class="end-section">
        <jb-button class="clear-button" color="dark" variant="ghost" size="xs">
            <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.11183 24C1.57504 24 1.03826 23.8023 0.614479 23.3786C-0.204826 22.5596 -0.204826 21.2039 0.614479 20.3848L20.3908 0.614298C21.2101 -0.204766 22.5662 -0.204766 23.3855 0.614298C24.2048 1.43336 24.2048 2.78905 23.3855 3.60811L3.60918 23.3786C3.1854 23.8023 2.64861 24 2.11183 24Z" fill="currentColor"/>
                <path d="M21.8882 24C21.3514 24 20.8146 23.8023 20.3908 23.3786L0.614479 3.60811C-0.204826 2.78905 -0.204826 1.43336 0.614479 0.614298C1.43378 -0.204766 2.78987 -0.204766 3.60918 0.614298L23.3855 20.3848C24.2048 21.2039 24.2048 22.5596 23.3855 23.3786C22.9617 23.8023 22.425 24 21.8882 24Z" fill="currentColor"/>
            </svg>
        </jb-button>
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
    <div class="popover-wrapper">
        <jb-popover class="select-list-wrapper">
            <div class="mobile-search-input-wrapper">
            <!-- Here we put search input in Mobile -->
            </div>
            <div class="select-list" tabindex="-1" role="listbox">
                <slot></slot>
            </div>
            <div class="empty-list-placeholder">
                <slot name="empty-list-message">no item available</slot>
            </div>
        </jb-popover>
    </div>
    <div class="message-box"></div>
  </div>
  `;
}