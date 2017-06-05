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
	            ruleForm: {
	                name: '',
	                region: '',
	                date1: '',
	                date2: '',
	                delivery: false,
	                type: [],
	                resource: '',
	                desc: ''
	            },
	            rules: {
	                name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
	                region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
	                date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
	                date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
	                type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
	                resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
	                desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
	            }
	        };
	    },
	    methods: {
	        submitForm: function submitForm(formName) {
	            this.$refs[formName].validate(function (valid) {
	                if (valid) {
	                    this.$alert('submit!');
	                } else {
	                    console.log('error submit!!');
	                    return false;
	                }
	            });
	        },
	        resetForm: function resetForm(formName) {
	            this.$refs[formName].resetFields();
	        }
	    }
	});

/***/ })
/******/ ]);