'use strict';

Rss.Router = function() {
    var _newHashObject;
    var _oldHashObject;
    var _self = this;
    
    this.setHash = function (hash) {
        window.location.hash = hash;
    }
    
    this.getHash = function () {
        return window.location.hash;
    }
    
    var _hashToObject = function(hash) {
        var hashArray  = hash.split('/');
        
        var hashObject = {
            module : hashArray[1] || 'index',
            action : hashArray[2] || 'index'
        }
        
        return hashObject;
    };
    
    var _objectToHash = function(object) {
        
    }
    
    var _loadModule = function() {
        var oldModuleScript = document.head.querySelector('script#module-script');
        if (oldModuleScript) document.head.removeChild(oldModuleScript);
        
        var scriptNode = document.createElement('script');
            scriptNode.id = 'module-script';
            scriptNode.src = '/assets/js/modules/' + _newHashObject.module + '.js';
            scriptNode.type = 'text/javascript';
            
        document.head.appendChild(scriptNode);
    }
    
    var _processHash = function () {
        _oldHashObject = _newHashObject;
        _newHashObject = _hashToObject(_self.getHash());
        _loadModule();
    }
    
    this.init = function() {
        _processHash();
        
        window.onhashchange = function () {
            _processHash();
        }
        
        return true;
    }
}