(function(root) {
  "use strict";

  root.$l = function ( arg ) {
    if (typeof arg === "string"){
      var htmlEls = document.querySelectorAll(arg);
      return new DOMNodeCollection(htmlEls);
    } else if (arg instanceof HTMLElement) {
      return new DOMNodeCollection([arg]);
    } else if (typeof arg === "function") {
      var interval = root.setInterval( function() {
        if ( document.readyState !== 'complete' ) return;
        clearInterval( interval );
          arg();
      }, 100 );
    }
  };



  var DOMNodeCollection = function(htmlEls){
    this.htmlEls = htmlEls;
    this.length = htmlEls.length;
  };

  DOMNodeCollection.prototype.html = function (string) {
    if (typeof string === "undefined") {
      return this.htmlEls[0].innerHTML;
    } else {
      this.forEach( function(htmlEl) {
        htmlEl.innerHTML = string;
      });
    }
  };

  DOMNodeCollection.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this.htmlEls[i]);
    }
  };
  // DOMNodeCollection.prototype.length = function () {
  //   return this.htmlEls.length;
  // };

  DOMNodeCollection.prototype.empty = function () {
    this.forEach( function(htmlEl) {
      htmlEl.innerHTML = "";
    });
  };

  DOMNodeCollection.prototype.append = function (input) {
    var injectContent = "";
    if (input instanceof DOMNodeCollection){
      this.forEach( function(htmlEl) {
        injectContent += htmlEl.outerHTML;
      });
    } else if ( input instanceof HTMLElement ) {
      injectContent += input.outerHTML;
    } else {
      injectContent += input;
    }
    this.forEach( function(htmlEl) {
      var existingHTML = htmlEl.innerHTML;
      htmlEl.innerHTML = existingHTML + injectContent;
    });
  };

  DOMNodeCollection.prototype.attr = function (input, val) {
    if ( arguments.length === 1 ) {
      if ( input instanceof String){
        return this.htmlEls[0].getAttribute(input);
      } else {
        var callback = function(htmlEl) {
          htmlEl.setAttribute(key, input[key]);
        };
        for (var key in input) {
          this.forEach(callback);
        }
      }
    } else {
      this.forEach( function(htmlEl) {
        htmlEl.setAttribute(input, val);
      });
    }
  };

  DOMNodeCollection.prototype.addClass = function (klass) {
    this.forEach( function (htmlEl) {
      htmlEl.classList.add(klass);
    });
  };

  DOMNodeCollection.prototype.removeClass = function (klass) {
    this.forEach( function (htmlEl) {
      htmlEl.classList.remove(klass);
    });
  };

  DOMNodeCollection.prototype.toggleClass = function (klass) {
    this.forEach( function (htmlEl) {
      htmlEl.classList.toggle(klass);
    });
  };

  DOMNodeCollection.prototype.showSennacy = function () {
    this.append("<img class ='sennacy' src='http://www.sennacy.com/sennacy.jpg'>");
  };

  DOMNodeCollection.prototype.children = function () {
    var allChildren = [];

    this.forEach( function (htmlEl) {
      allChildren = allChildren.concat( [].slice.call(htmlEl.children) );
    });

    return new DOMNodeCollection( allChildren );
  };

  DOMNodeCollection.prototype.first = function () {
    return new DOMNodeCollection([this.htmlEls[0]]);
  };

  DOMNodeCollection.prototype.last = function () {
    return new DOMNodeCollection([this.htmlEls[ this.length - 1 ]]);
  };

  DOMNodeCollection.prototype.firstChild = function () {
    return this.children().first();
  };

  DOMNodeCollection.prototype.lastChild = function () {
    return this.children().last();
  };

  DOMNodeCollection.prototype.parent = function () {
    var allParents = [];

    this.forEach( function (htmlEl) {
      var parent = htmlEl.parentElement;
      if(parent){allParents = allParents.concat(parent);}
    });


    return new DOMNodeCollection( allParents );
  };

  DOMNodeCollection.prototype.find = function (selector) {
    var allMatches = [];
    this.forEach ( function (htmlEl){
      var found = [].slice.call(htmlEl.querySelectorAll(selector));
      allMatches = allMatches.concat(found);
    });
    return new DOMNodeCollection(allMatches);
  };

  DOMNodeCollection.prototype.remove = function () {
    this.forEach( function(htmlEl) {
      htmlEl.outerHTML = "";
    });

    this.htmlEls = [];
  };

  DOMNodeCollection.prototype.on = function (event, callback) {
    this.forEach( function(htmlEl) {
      htmlEl.addEventListener(event, callback);
    });
  };

  DOMNodeCollection.prototype.off = function (event, callback) {
    this.forEach( function(htmlEl) {
      htmlEl.removeEventListener(event, callback);
    });
  };

  root.$l.extend = function (base) {
    var args = [].slice.call(arguments, 1);

    for ( var i = 0; i < args.length; i++ ) {
      for ( var key in args[i] ) {
        base[key] = args[i][key];
      }
    }
    return base;
  };

  root.$l.ajax = function (options) {
    var defaults = {
      success: root.$l.success,
      error: root.$l.error,
      url: root.location.href,
      method: "GET",
      data: "",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8"
    };

    options = root.$l.extend(defaults, options);
    root.$l.loadXMLDoc(options);
  };

  root.$l.error = function () {
    return "error!";
  };

  root.$l.success = function () {
    return "success!";
  };

  root.$l.loadXMLDoc = function (options) {
    var xmlhttp;
    if (root.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if(xmlhttp.status == 200){
               options.success(xmlhttp.responseText);
           }
           else if(xmlhttp.status == 400) {
              options.error(xmlhttp.responseText);
           }
           else {
               options.error(xmlhttp.responseText);
           }
        }
    };

    xmlhttp.open(options.method, options.url, true);
    xmlhttp.send();
  };
})(this);
