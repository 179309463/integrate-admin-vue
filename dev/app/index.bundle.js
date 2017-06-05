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

	Vue.directive('autoHeight', {
	    bind: function bind(el) {
	        var delHeight = el.dataset.delHeight || 0;
	        el.style['height'] = window.innerHeight - delHeight + 'px';
	        el.style['max-height'] = window.innerHeight - delHeight + 'px';

	        window.onresize = function () {
	            el.style['height'] = window.innerHeight - delHeight + 'px';
	            el.style['max-height'] = window.innerHeight - delHeight + 'px';
	        };
	    }
	});

	var vm = new Vue({
	    el: '#app',
	    created: function created() {
	        var _this = this;
	        window.vm = _this;

	        _this.getMenu();
	    },
	    data: function data() {
	        return {
	            //菜单最多3级
	            menu: [
	                /*{
	                    id: 1
	                    name: '组件示例'
	                    href: ''
	                    target: 'mainFrame'
	                    children: [
	                        {
	                            id: 2
	                            name: '常规组件示例'
	                            href: '/view/demo/simple-demo.html'
	                            target: 'mainFrame'
	                            children: []
	                        }
	                        {
	                            id: 3
	                            name: '表单示例'
	                            href: '/view/demo/form-demo.html'
	                            target: 'mainFrame'
	                            children: []
	                        }
	                        {
	                            id: 4
	                            name: '列表页示例'
	                            href: '/view/demo/list-demo.html'
	                            target: 'mainFrame'
	                            children: []
	                        }
	                    ]
	                }*/
	            ],
	            tabValue: 'frame_2',
	            tabs: [{
	                title: '常规组件示例',
	                name: 'frame_2',
	                content: '/view/demo/simple-demo.html'
	            }]
	        };
	    },
	    methods: {
	        getMenu: function getMenu() {
	            var _this = this;

	            _this.$http({
	                method: 'get',
	                url: '/data/menu.json'
	            }).then(function (res) {
	                _this.menu = _this.processData(JSON.parse(res.data)['data']);
	            });
	        },
	        processData: function processData(data) {
	            var result = [],
	                process = function process(pid, list, targetList) {
	                list.forEach(function (item, i) {

	                    if (typeof item.subMenu == 'undefined') {
	                        item.subMenu = [];
	                    }

	                    if (item.parent_id == pid) {
	                        targetList.push(item);
	                        process(item.id, list, item.subMenu);
	                    }
	                });
	            };

	            process(0, data, result);

	            return result;
	        },
	        handleOpen: function handleOpen(index, indexPath, item) {
	            console.log(index, indexPath);
	        },
	        handleClose: function handleClose(index, indexPath, item) {
	            console.log(index, indexPath);
	        },
	        handleSelect: function handleSelect(index, indexPath, item) {
	            console.log(index, indexPath);
	            var _this = this,
	                arr = item.route.split('|'),
	                id = arr[0] || 0,
	                title = arr[1] || '未知标题',
	                content = arr[2] || '',
	                target = arr[3] || 'mainFrame';

	            if (target == 'mainFrame') {
	                _this.addTab(id, title, content);
	            } else {
	                window.open(content);
	            }
	        },
	        addTab: function addTab(id, title, content) {
	            var _this = this,
	                tabs = _this.tabs,
	                flag = false;

	            tabs.forEach(function (tab, index) {
	                if (tab.name === 'frame_' + id) {
	                    //当前tab已存在
	                    flag = true;
	                }
	            });

	            if (!flag) {
	                _this.tabs.push({
	                    title: title,
	                    name: 'frame_' + id,
	                    content: content
	                });
	            }
	            _this.tabValue = 'frame_' + id;
	        },
	        removeTab: function removeTab(targetName) {
	            var _this = this,
	                tabs = _this.tabs,
	                activeName = _this.tabValue;

	            if (activeName === targetName) {
	                tabs.forEach(function (tab, index) {
	                    if (tab.name === targetName) {
	                        var nextTab = tabs[index + 1] || tabs[index - 1];
	                        if (nextTab) {
	                            activeName = nextTab.name;
	                        }
	                    }
	                });
	            }

	            _this.tabValue = activeName;
	            _this.tabs = tabs.filter(function (tab) {
	                return tab.name !== targetName;
	            });
	        }
	    }
	});

/***/ })
/******/ ]);