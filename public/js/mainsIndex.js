/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/js/main.js":
/*!*****************************!*\
  !*** ./frontend/js/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DOM: () => (/* binding */ DOM),\n/* harmony export */   Event: () => (/* binding */ Event),\n/* harmony export */   Handler: () => (/* binding */ Handler)\n/* harmony export */ });\n/* harmony import */ var _scss_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/styles.scss */ \"./frontend/scss/styles.scss\");\n\nclass DOM {\n  constructor(doms) {\n    this.doms = [];\n    for (const dom of doms) {\n      this.doms.push(document.getElementById(dom));\n    }\n  }\n}\nclass Handler {\n  constructor() {}\n}\nclass Event {\n  constructor() {}\n}\n\n\n//# sourceURL=webpack://generics/./frontend/js/main.js?");

/***/ }),

/***/ "./frontend/js/mains/index.js":
/*!************************************!*\
  !*** ./frontend/js/mains/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../main */ \"./frontend/js/main.js\");\n\nconst videoDOMs = document.querySelectorAll(\"#main video\");\nconst imageDOMs = document.querySelectorAll(\"#main img\");\nvideoDOMs.forEach(videoDOM => {\n  videoDOM.addEventListener(\"click\", () => {\n    if (videoDOM.paused) {\n      videoDOM.play();\n    } else {\n      videoDOM.pause();\n    }\n  });\n});\nimageDOMs.forEach(imageDOM => {\n  imageDOM.addEventListener(\"click\", () => {});\n});\nclass MainDOM extends _main__WEBPACK_IMPORTED_MODULE_0__.DOM {\n  constructor() {\n    // TODO: 입력받은 DOM 하위 DOM을 id로 할당\n    // const mainDOM = document.getElementById(\"main\");\n    // super(mainDOM);\n  }\n}\n\n//# sourceURL=webpack://generics/./frontend/js/mains/index.js?");

/***/ }),

/***/ "./frontend/scss/styles.scss":
/*!***********************************!*\
  !*** ./frontend/scss/styles.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://generics/./frontend/scss/styles.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./frontend/js/mains/index.js");
/******/ 	
/******/ })()
;