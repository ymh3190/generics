/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/js/header/bars.js":
/*!************************************!*\
  !*** ./frontend/js/header/bars.js ***!
  \************************************/
/***/ (() => {

eval("const barsDOM = document.getElementById(\"bars\");\nconst navDOM = document.getElementById(\"nav\");\nconst anchorDOMs = navDOM.querySelectorAll(\"a\");\nbarsDOM.addEventListener(\"click\", () => {\n  for (const anchorDOM of anchorDOMs) {\n    if (anchorDOM.classList.contains(\"column\")) {\n      anchorDOM.classList.remove(\"column\");\n      anchorDOM.classList.add(\"flex\");\n      const iconDOM = anchorDOM.querySelector(\"i\");\n      iconDOM.classList.remove(\"margin-bottom\");\n      iconDOM.classList.add(\"margin-right\");\n    } else if (anchorDOM.classList.contains(\"flex\")) {\n      anchorDOM.classList.remove(\"flex\");\n      anchorDOM.classList.add(\"column\");\n      const iconDOM = anchorDOM.querySelector(\"i\");\n      iconDOM.classList.remove(\"margin-right\");\n      iconDOM.classList.add(\"margin-bottom\");\n    }\n  }\n});\n\n//# sourceURL=webpack://generics/./frontend/js/header/bars.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./frontend/js/header/bars.js"]();
/******/ 	
/******/ })()
;