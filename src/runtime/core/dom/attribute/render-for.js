import Log from "../../../../utils/log.js";
import { effect } from "@vue/reactivity";

/**
 * 渲染v-for的元素
 * @param {[]} arr
 * @param {() => HTMLElement} renderChildFn
 * @param {HTMLElement} el
 * @param {string} fieldName
 * @returns {*}
 */
export function renderList(arr, renderChildFn, el, fieldName) {
    if (!arr) {
        Log.error(`Cannot read properties of undefined (reading '${fieldName.replace("ctx.")}')`);
    }
    let cache = [];
    effect(() => {
        let _cache = [];
        const _documentFragment = document.createDocumentFragment();

        const elements = arr.map(renderChildFn);
        elements.forEach(_element => {
            const element = _element.renderFn();
            _cache.push(element);
            _documentFragment.appendChild(element);
        });
        const firstElement = cache[0];
        if (firstElement && firstElement.parentElement === el) {
            el.insertBefore(_documentFragment, firstElement);
        } else {
            el.appendChild(_documentFragment);
        }
        cache.forEach(item => {
            el.removeChild(item);
        })
        cache = _cache;
    })
}
