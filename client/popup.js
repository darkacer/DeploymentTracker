import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import Popup from 'ui/popup';

const elm = createElement('ui-popup', { is: Popup });
document.body.appendChild(elm);

// document.getElementById('show-orgs').addEventListener('click', function () {
//     window.open(chrome.runtime.getURL('popup/index.html'));
// });
