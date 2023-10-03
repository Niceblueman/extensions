/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var analytics = __webpack_require__(2);
	analytics.inject();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var uuid = __webpack_require__(3);
	
	var analytics = {
	  pushEvent: function pushEvent(analyticsEvent) {
	    /* run from page script */
	    window.postMessage({ omeglewebcamAnalyticsEvent: analyticsEvent }, '*');
	  },
	
	  setupMessagePasser: function setupMessagePasser() {
	    /* run from content script */
	
	    chrome.runtime.sendMessage({
	      omeglewebcamAnalyticsEvent: {
	        t: 'pageview'
	      }
	    });
	
	    setInterval(function () {
	      chrome.runtime.sendMessage({
	        omeglewebcamAnalyticsEvent: {
	          t: 'event',
	          ec: 'pulse',
	          ea: ''
	        }
	      });
	    }, 1000 * 60 * 5);
	
	    window.addEventListener('message', function (event) {
	      if (event.data.omeglewebcamAnalyticsEvent) {
	        chrome.runtime.sendMessage({
	          omeglewebcamAnalyticsEvent: event.data.omeglewebcamAnalyticsEvent
	        });
	      }
	    });
	  },
	
	  inject: function inject() {
	    /* run from background script */
	
	    function encode(object) {
	      var parts = [];
	      for (var key in object) {
	        parts.push(encodeURI(key) + '=' + encodeURI(object[key]));
	      }
	      return parts.join('&');
	    }
	
	    chrome.runtime.onMessage.addListener(function (message) {
	      if (!message.omeglewebcamAnalyticsEvent) {
	        return;
	      }
	
	      var request = new XMLHttpRequest();
	      var payload = {
	        v: 1,
	        tid: 'UA-84264854-1',
	        cid: localStorage.googleAnalyticsClientId = localStorage.googleAnalyticsClientId || uuid.generateUUID(),
	        sr: window.screen.width + 'x' + window.screen.height,
	        vp: window.innerWidth + 'x' + window.innerHeight
	      };
	      for (var key in message.omeglewebcamAnalyticsEvent) {
	        payload[key] = message.omeglewebcamAnalyticsEvent[key];
	      }
	      request.open('POST', 'https://www.google-analytics.com/collect');
	      var cacheBuster = '&z=' + (Math.random() * 16 | 0);
	      request.send(encode(payload) + cacheBuster);
	    });
	  }
	};
	
	module.exports = analytics;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	function generateUUID() {
	  /* adapted from http://stackoverflow.com/a/2117523 */
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0,
	        v = c === 'x' ? r : r & 0x3 | 0x8;
	    return v.toString(16);
	  });
	}
	
	module.exports = {
	  generateUUID: generateUUID
	};

/***/ }
/******/ ]);
//# sourceMappingURL=background.js.map