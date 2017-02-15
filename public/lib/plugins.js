!function(factory){
	"function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function($){

    $.fn.translate = function(){
        return this.each(function() { 
            var key = $(this).data('trcode');
            if(typeof key !== 'undefined') {
                if(!(key in App.Dictionary)) 
                    $.post('/api/dictionary', { lang: 'en', code: key, value: $(this).html().trim() });
                var value = key in App.Dictionary ? App.Dictionary[key] : $(this).html().trim();
                switch(this.tagName.toLowerCase()){
                    case 'input':
                    case 'textarea':
                        $(this).attr('placeholder', value);
                        break;
                    case 'optgroup':    
                        $(this).attr('label', value);
                        break;
                    default:
                        $(this).html(value);
                }
            }
        });
    };
    
	$.fn.serializeObject = function () {
		"use strict";
		
		var result = {};
		var add = function(root, name, value){
			var k = name.shift();
			if(name.length == 0){
				if(typeof root[k] === 'undefined') 
					root[k] = value; 
				else if(Array.isArray(root[k])) 
					root[k].push(value);
				else 
					root[k] = [root[k], value];
			} else {
				if(typeof root[k] === 'undefined')
					root[k] = {};
				add(root[k], name, value)
			}
		}

		this.serializeArray().forEach(function(item){
			add(result, item.name.split('.'), item.value);
		})
		return result;
	};
	
	jQuery.fn.tagName = function() {
		return this.prop("tagName").toLowerCase();
	};
	
	jQuery.fn.selectText = function() {
		var range, selection;
		return this.each(function() {
			if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(this);
				range.select();
			} else if (window.getSelection) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(this);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		});
	};	
});
