'use strict';

Rss.Ajax = function(settings) {
    var _data   = settings.data || null;
    var _url    = settings.url || null;
    var _method = settings.method || 'GET';
    var _async  = (settings.async === false) ? false : true;
    var _success = (typeof settings.success === 'function') ? settings.success : null;
    
    if (!_url) {
            throw new Error('Ajax needs the "url" in settings param');
        }
        
        if (_data) {
            if (_url.indexOf('?') === -1) {
                _url += '?' + _data;
            } else {
                _url += '&' + _data;
            }
        }
    
    var _xmlHttpRequest = new XMLHttpRequest();

    if (_success) {
        _xmlHttpRequest.onreadystatechange = function () {
            if (_xmlHttpRequest.readyState==4 && _xmlHttpRequest.status==200) {
                if (_success) {
                    _success.call(null, _xmlHttpRequest.responseText, _xmlHttpRequest);
                }

            }
        }
    }

    _xmlHttpRequest.open(_method, _url, _async);
    _xmlHttpRequest.send();
}