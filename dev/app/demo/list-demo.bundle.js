/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	var vm = new Vue({
	    el: '#app',
	    created: function created() {
	        var _this = this;
	        window.vm = _this;
	    },
	    data: function data() {
	        return {
	            formInline: {
	                user: '',
	                region: ''
	            },
	            tableData: [{
	                date: '2016-05-03',
	                name: '王小虎',
	                province: '上海',
	                city: '普陀区',
	                address: '上海市普陀区金沙江路 1518 弄',
	                zip: 200333,
	                mobile: 1380013800
	            }, {
	                date: '2016-05-02',
	                name: '王小虎',
	                province: '上海',
	                city: '普陀区',
	                address: '上海市普陀区金沙江路 1518 弄',
	                zip: 200333
	            }, {
	                date: '2016-05-04',
	                name: '王小虎',
	                province: '上海',
	                city: '普陀区',
	                address: '上海市普陀区金沙江路 1518 弄',
	                zip: 200333
	            }, {
	                date: '2016-05-01',
	                name: '王小虎',
	                province: '上海',
	                city: '普陀区',
	                address: '上海市普陀区金沙江路 1518 弄',
	                zip: 200333
	            }],
	            currentPage: 1,
	            pageSize: 100,
	            total: 500
	        };
	    },
	    methods: {
	        onSubmit: function onSubmit() {
	            console.log('submit!');
	        },
	        handleClick: function handleClick(index, row) {
	            console.info(index);
	            console.info(row);
	        },
	        handleSizeChange: function handleSizeChange(val) {
	            console.log('每页' + val + '条');
	        },
	        handleCurrentChange: function handleCurrentChange(val) {
	            console.log('当前页:' + val);
	        }
	    }
	});

/***/ })
/******/ ]);