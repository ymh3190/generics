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

/***/ "./frontend/js/contents/watch.js":
/*!***************************************!*\
  !*** ./frontend/js/contents/watch.js ***!
  \***************************************/
/***/ (() => {

eval("const barsDOM = document.getElementById(\"bars\");\nconst navDOM = document.getElementById(\"nav\");\nnavDOM.classList.add(\"hide\");\nbarsDOM.addEventListener(\"click\", () => {\n  if (navDOM.classList.contains(\"hide\")) {\n    navDOM.classList.remove(\"hide\");\n  } else {\n    navDOM.classList.add(\"hide\");\n  }\n});\n\n//# sourceURL=webpack://generics/./frontend/js/contents/watch.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./frontend/js/contents/watch.js"]();
/******/ 	
/******/ })()
;