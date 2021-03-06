'use strict';

Vue.directive('autoHeight', {
    bind: function (el) {
        var delHeight = el.dataset.delHeight || 0;
        el.style['height'] = (window.innerHeight - delHeight) + 'px';
        el.style['max-height'] = (window.innerHeight - delHeight) + 'px';

        window.onresize = function () {
            el.style['height'] = (window.innerHeight - delHeight) + 'px';
            el.style['max-height'] = (window.innerHeight - delHeight) + 'px';
        }
    }
});

var vm = new Vue({
    el: '#app',
    created: function () {
        var _this = this;
        window.vm = _this;

        _this.getMenu();
    },
    data: function () {
        return {
            //菜单最多3级
            menu: [
                /*{
                    id: 1,
                    name: '组件示例',
                    href: '',
                    target: 'mainFrame',
                    children: [
                        {
                            id: 2,
                            name: '常规组件示例',
                            href: '/view/demo/simple-demo.html',
                            target: 'mainFrame',
                            children: []
                        },
                        {
                            id: 3,
                            name: '表单示例',
                            href: '/view/demo/form-demo.html',
                            target: 'mainFrame',
                            children: []
                        },
                        {
                            id: 4,
                            name: '列表页示例',
                            href: '/view/demo/list-demo.html',
                            target: 'mainFrame',
                            children: []
                        }
                    ]
                }*/
            ],
            tabValue: 'frame_2',
            tabs: [
                {
                    title: '常规组件示例',
                    name: 'frame_2',
                    content: '/view/demo/simple-demo.html'
                }
            ]
        }
    },
    methods: {
        getMenu: function () {
            var _this = this;

            _this.$http({
                method: 'get',
                url: '/data/menu.json'
            }).then(function (res) {
                _this.menu = _this.processData(JSON.parse(res.data)['data']);
            });
        },
        processData: function (data) {
            var result = [],
                process = function (pid, list, targetList) {
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
        handleOpen: function (index, indexPath, item) {
            console.log(index, indexPath);
        },
        handleClose: function (index, indexPath, item) {
            console.log(index, indexPath);
        },
        handleSelect: function (index, indexPath, item) {
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
        addTab: function (id, title, content) {
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
        removeTab: function (targetName) {
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
