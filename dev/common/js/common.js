'use strict';
window.xhrPool = window.xhrPool || {
    count: 0
};

Vue.use(VueResource);

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function (request, next) {
    if (typeof xhrPool[request.url] == 'undefined') {
        xhrPool[request.url] = request;
        xhrPool['count'] = xhrPool['count'] + 1;
    } else {
        xhrPool[request.url] = request;
    }

    if (xhrPool['count'] > 0) {
        //window.store.dispatch('showLoading');
    }

    next(function (response) {
        delete xhrPool[request.url];
        xhrPool['count'] = xhrPool['count'] - 1;

        if (xhrPool['count'] == 0) {
            //window.store.dispatch('hideLoading');
        }

        if (response.body.code != 200) {
            //window.store.dispatch('showTips', response.body.msg);
        }
    });
});
