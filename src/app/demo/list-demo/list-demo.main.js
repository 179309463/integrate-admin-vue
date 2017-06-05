'use strict';

var vm = new Vue({
    el: '#app',
    created: function () {
        var _this = this;
        window.vm = _this;
    },
    data: function () {
        return {
            formInline: {
                user: '',
                region: ''
            },
            tableData: [
                {
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
                }
            ],
            currentPage: 1,
            pageSize: 100,
            total: 500
        };
    },
    methods: {
        onSubmit: function () {
            console.log('submit!');
        },
        handleClick: function (index, row) {
            console.info(index);
            console.info(row);
        },
        handleSizeChange: function (val) {
            console.log('每页' + val + '条');
        },
        handleCurrentChange: function (val) {
            console.log('当前页:' + val);
        }
    }
});
