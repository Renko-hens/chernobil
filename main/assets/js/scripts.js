// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb) {
  var start = window.scrollY || document.documentElement.scrollTop,
      currentTime = null;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    window.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
// File#: _1_anim-menu-btn
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
  var backTop = document.getElementsByClassName('js-back-to-top')[0];
  if( backTop ) {
    var dataElement = backTop.getAttribute('data-element');
    var scrollElement = dataElement ? document.querySelector(dataElement) : window;
    var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
      scrollOffset = parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
      scrolling = false;
    
    //detect click on back-to-top link
    backTop.addEventListener('click', function(event) {
      event.preventDefault();
      if(!window.requestAnimationFrame) {
        scrollElement.scrollTo(0, 0);
      } else {
        dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
      } 
      //move the focus to the #top-element - don't break keyboard navigation
      Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
    });
    
    //listen to the window scroll and update back-to-top visibility
    checkBackToTop();
    if (scrollOffset > 0) {
      scrollElement.addEventListener("scroll", function(event) {
        if( !scrolling ) {
          scrolling = true;
          (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
        }
      });
    }

    function checkBackToTop() {
      var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
      if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
      Util.toggleClass(backTop, 'back-to-top--is-visible', windowTop >= scrollOffset);
      scrolling = false;
    }
  }
}());
// File#: _1_masonry
// Usage: codyhouse.co/license

(function() {
  var Masonry = function(element) {
    this.element = element;
    this.list = this.element.getElementsByClassName('js-masonry__list')[0];
    this.items = this.element.getElementsByClassName('js-masonry__item');
    this.activeColumns = 0;
    this.colStartWidth = 0; // col min-width (defined in CSS using --masonry-col-auto-size variable)
    this.colWidth = 0; // effective column width
    this.colGap = 0;
    // store col heights and items
    this.colHeights = [];
    this.colItems = [];
    // flex full support
    this.flexSupported = checkFlexSupported(this.items[0]);
    getGridLayout(this); // get initial grid params
    setGridLayout(this); // set grid params (width of elements)
    initMasonryLayout(this); // init gallery layout
  };

  function checkFlexSupported(item) {
    var itemStyle = window.getComputedStyle(item);
    return itemStyle.getPropertyValue('flex-basis') != 'auto';
  };

  function getGridLayout(grid) { // this is used to get initial grid details (width/grid gap)
    var itemStyle = window.getComputedStyle(grid.items[0]);
    if( grid.colStartWidth == 0) {
      grid.colStartWidth = parseFloat(itemStyle.getPropertyValue('width'));
    }
    grid.colGap = parseFloat(itemStyle.getPropertyValue('margin-right'));
  };

  function setGridLayout(grid) { // set width of items in the grid
    var contanerWidth = parseFloat(window.getComputedStyle(grid.element).getPropertyValue('width'));
    grid.activeColumns = parseInt((contanerWidth + grid.colGap)/(grid.colStartWidth+grid.colGap));
    grid.colWidth = parseFloat((contanerWidth - (grid.activeColumns - 1)*grid.colGap)/grid.activeColumns);
    for(var i = 0; i < grid.items.length; i++) {
      grid.items[i].style.width = grid.colWidth+'px'; // reset items width
    }
  };

  function initMasonryLayout(grid) {
    if(grid.flexSupported) {
      checkImgLoaded(grid); // reset layout when images are loaded
    } else {
      Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
    }

    grid.element.addEventListener('masonry-resize', function(){ // window has been resized -> reset masonry layout
      getGridLayout(grid);
      setGridLayout(grid);
      if(grid.flexSupported) layItems(grid); 
    });

    grid.element.addEventListener('masonry-reset', function(event){ // reset layout (e.g., new items added to the gallery)
      if(grid.flexSupported) checkImgLoaded(grid); 
    });
  };

  function layItems(grid) {
    Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
    grid.colHeights = [];
    grid.colItems = [];

    // grid layout has already been set -> update container height and order of items
    for(var j = 0; j < grid.activeColumns; j++) {
      grid.colHeights.push(0); // reset col heights
      grid.colItems[j] = []; // reset items order
    }
    
    for(var i = 0; i < grid.items.length; i++) {
      var minHeight = Math.min.apply( Math, grid.colHeights ),
        index = grid.colHeights.indexOf(minHeight);
      grid.colItems[index].push(i);
      grid.items[i].style.flexBasis = 0; // reset flex basis before getting height
      var itemHeight = grid.items[i].getBoundingClientRect().height || grid.items[i].offsetHeight || 1;
      grid.colHeights[index] = grid.colHeights[index] + grid.colGap + itemHeight;
    }

    // reset height of container
    var masonryHeight = Math.max.apply( Math, grid.colHeights ) + 5;
    grid.list.style.cssText = 'height: '+ masonryHeight + 'px;';

    // go through elements and set flex order
    var order = 0;
    for(var i = 0; i < grid.colItems.length; i++) {
      for(var j = 0; j < grid.colItems[i].length; j++) {
        grid.items[grid.colItems[i][j]].style.order = order;
        order = order + 1;
      }
      // change flex-basis of last element of each column, so that next element shifts to next col
      var lastItemCol = grid.items[grid.colItems[i][grid.colItems[i].length - 1]];
      lastItemCol.style.flexBasis = masonryHeight - grid.colHeights[i] + lastItemCol.getBoundingClientRect().height - 5 + 'px';
    }

    // emit custom event when grid has been reset
    grid.element.dispatchEvent(new CustomEvent('masonry-laid'));
  };

  function checkImgLoaded(grid) {
    var imgs = grid.list.getElementsByTagName('img');

    function countLoaded() {
      var count = 0;
      for(var i = 0; i < imgs.length; i++) {
        if (typeof imgs[i].naturalHeight !== "undefined" && imgs[i].naturalHeight == 0) {
          break;
        }
        count = count+1;
      }

      if(count == imgs.length) {
        layItems(grid);
      } else {
        setTimeout(function(){
          countLoaded();
        }, 100);
      }
    };

    if(imgs.length == 0) {
      layItems(grid); // no need to wait -> no img available
    } else {
      countLoaded();
    }
  };

  //initialize the Masonry objects
  var masonries = document.getElementsByClassName('js-masonry'), 
    flexSupported = Util.cssSupports('flex-basis', 'auto'),
    masonriesArray = [];

  if( masonries.length > 0) {
    for( var i = 0; i < masonries.length; i++) {
      if(!flexSupported) {
        Util.addClass(masonries[i], 'masonry--loaded'); // reveal gallery
      } else {
        (function(i){masonriesArray.push(new Masonry(masonries[i]));})(i); // init Masonry Layout
      }
    }

    if(!flexSupported) return;

    // listen to window resize -> reorganize items in gallery
    var resizingId = false,
      customEvent = new CustomEvent('masonry-resize');
      
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      for( var i = 0; i < masonriesArray.length; i++) {
        (function(i){masonriesArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  };
}());
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
  var Menu = function(element) {
    this.element = element;
    this.elementId = this.element.getAttribute('id');
    this.menuItems = this.element.getElementsByClassName('js-menu__content');
    this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
    this.selectedTrigger = false;
    this.menuIsOpen = false;
    this.initMenu();
    this.initMenuEvents();
  };	

  Menu.prototype.initMenu = function() {
    // init aria-labels
    for(var i = 0; i < this.trigger.length; i++) {
      Util.setAttributes(this.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
    }
    // init tabindex
    for(var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].setAttribute('tabindex', '0');
    }
  };

  Menu.prototype.initMenuEvents = function() {
    var self = this;
    for(var i = 0; i < this.trigger.length; i++) {(function(i){
      self.trigger[i].addEventListener('click', function(event){
        event.preventDefault();
        // if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
        if(Util.hasClass(self.element, 'menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
          self.toggleMenu(false, false); // close menu
        }
        // toggle menu
        self.selectedTrigger = self.trigger[i];
        self.toggleMenu(!Util.hasClass(self.element, 'menu--is-visible'), true);
      });
    })(i);}
    
    // keyboard events
    this.element.addEventListener('keydown', function(event) {
      // use up/down arrow to navigate list of menu items
      if( !Util.hasClass(event.target, 'js-menu__content') ) return;
      if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
        self.navigateItems(event, 'next');
      } else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
        self.navigateItems(event, 'prev');
      }
    });
  };

  Menu.prototype.toggleMenu = function(bool, moveFocus) {
    var self = this;
    // toggle menu visibility
    Util.toggleClass(this.element, 'menu--is-visible', bool);
    this.menuIsOpen = bool;
    if(bool) {
      this.selectedTrigger.setAttribute('aria-expanded', 'true');
      Util.moveFocus(this.menuItems[0]);
      this.element.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
      // position the menu element
      this.positionMenu();
      // add class to menu trigger
      Util.addClass(this.selectedTrigger, 'menu-control--active');
    } else if(this.selectedTrigger) {
      this.selectedTrigger.setAttribute('aria-expanded', 'false');
      if(moveFocus) Util.moveFocus(this.selectedTrigger);
      // remove class from menu trigger
      Util.removeClass(this.selectedTrigger, 'menu-control--active');
      this.selectedTrigger = false;
    }
  };

  Menu.prototype.positionMenu = function(event, direction) {
    var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
      menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
      // menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
      
    var left = selectedTriggerPosition.left,
      right = (window.innerWidth - selectedTriggerPosition.right),
      isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);

    var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
      vertical = menuOnTop
        ? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
        : 'top: '+selectedTriggerPosition.bottom+'px;';
    // check right position is correct -> otherwise set left to 0
    if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
    var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
    this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
  };

  Menu.prototype.navigateItems = function(event, direction) {
    event.preventDefault();
    var index = Util.getIndexInArray(this.menuItems, event.target),
      nextIndex = direction == 'next' ? index + 1 : index - 1;
    if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
    if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
    Util.moveFocus(this.menuItems[nextIndex]);
  };

  Menu.prototype.checkMenuFocus = function() {
    var menuParent = document.activeElement.closest('.js-menu');
    if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
  };

  Menu.prototype.checkMenuClick = function(target) {
    if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
  };

  window.Menu = Menu;

  //initialize the Menu objects
  var menus = document.getElementsByClassName('js-menu');
  if( menus.length > 0 ) {
    var menusArray = [];
    for( var i = 0; i < menus.length; i++) {
      (function(i){menusArray.push(new Menu(menus[i]));})(i);
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
        //close menu if focus is outside menu element
        menusArray.forEach(function(element){
          element.checkMenuFocus();
        });
      } else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close menu on 'Esc'
        menusArray.forEach(function(element){
          element.toggleMenu(false, false);
        });
      } 
    });
    // close menu when clicking outside it
    window.addEventListener('click', function(event){
      menusArray.forEach(function(element){
        element.checkMenuClick(event.target);
      });
    });
    // on resize -> close all menu elements
    window.addEventListener('resize', function(event){
      menusArray.forEach(function(element){
        element.toggleMenu(false, false);
      });
    });
    // on scroll -> close all menu elements
    window.addEventListener('scroll', function(event){
      menusArray.forEach(function(element){
        if(element.menuIsOpen) element.toggleMenu(false, false);
      });
    });
  }
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
  var Modal = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.initModal = function() {
    var self = this;
    //open modal when clicking on trigger buttons
    if ( this.triggers ) {
      for(var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener('click', function(event) {
          event.preventDefault();
          self.selectedTrigger = event.target;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener('openModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener('closeModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });
  };

  Modal.prototype.showModal = function() {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    this.firstFocusable.focus();
    // wait for the end of transitions before moving focus
    this.element.addEventListener("transitionend", function cb(event) {
      self.firstFocusable.focus();
      self.element.removeEventListener("transitionend", cb);
    });
    this.emitModalEvents('modalIsOpen');
  };

  Modal.prototype.closeModal = function() {
    if(!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    if(this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelModalEvents();
    this.emitModalEvents('modalIsClose');
  };

  Modal.prototype.initModalEvents = function() {
    //add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  };

  Modal.prototype.cancelModalEvents = function() {
    //remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch(event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function(event) {
    if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside modal
      this.trapFocus(event);
    } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }	
  };

  Modal.prototype.initClick = function(event) {
    //close modal when clicking on close button or modal bg layer 
    if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function(event) {
    if( this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if( this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  Modal.prototype.getFocusableElements = function() {
    //get all focusable elements inside the modal
    var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
  };

  Modal.prototype.getFirstVisible = function(elements) {
    //get first visible focusable element inside the modal
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        this.firstFocusable = elements[i];
        return true;
      }
    }
  };

  Modal.prototype.getLastVisible = function(elements) {
    //get last visible focusable element inside the modal
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        this.lastFocusable = elements[i];
        return true;
      }
    }
  };

  Modal.prototype.emitModalEvents = function(eventName) {
    var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
    this.element.dispatchEvent(event);
  };

  //initialize the Modal objects
  var modals = document.getElementsByClassName('js-modal');
  if( modals.length > 0 ) {
    var modalArrays = [];
    for( var i = 0; i < modals.length; i++) {
      (function(i){modalArrays.push(new Modal(modals[i]));})(i);
    }

    window.addEventListener('keydown', function(event){ //close modal window on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        for( var i = 0; i < modalArrays.length; i++) {
          (function(i){modalArrays[i].closeModal();})(i);
        };
      }
    });
  }
}());
// File#: _1_sticky-hero
// Usage: codyhouse.co/license
(function() {
  var StickyBackground = function(element) {
    this.element = element;
    this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
    this.nextElement = this.element.nextElementSibling;
    this.scrollingTreshold = 0;
    this.nextTreshold = 0;
    initStickyEffect(this);
  };

  function initStickyEffect(element) {
    var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
    observer.observe(element.scrollingElement);
    if(element.nextElement) observer.observe(element.nextElement);
  };

  function stickyCallback(entries, observer) {
    var threshold = entries[0].intersectionRatio.toFixed(1);
    (entries[0].target ==  this.scrollingElement)
      ? this.scrollingTreshold = threshold
      : this.nextTreshold = threshold;

    Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
  };


  var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
    for(var i = 0; i < stickyBackground.length; i++) {
      (function(i){ // if animations are enabled -> init the StickyBackground object
        if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
      })(i);
    }
  }
}());
// File#: _1_swipe-content
(function() {
  var SwipeContent = function(element) {
    this.element = element;
    this.delta = [false, false];
    this.dragging = false;
    this.intervalId = false;
    initSwipeContent(this);
  };

  function initSwipeContent(content) {
    content.element.addEventListener('mousedown', handleEvent.bind(content));
    content.element.addEventListener('touchstart', handleEvent.bind(content));
  };

  function initDragging(content) {
    //add event listeners
    content.element.addEventListener('mousemove', handleEvent.bind(content));
    content.element.addEventListener('touchmove', handleEvent.bind(content));
    content.element.addEventListener('mouseup', handleEvent.bind(content));
    content.element.addEventListener('mouseleave', handleEvent.bind(content));
    content.element.addEventListener('touchend', handleEvent.bind(content));
  };

  function cancelDragging(content) {
    //remove event listeners
    if(content.intervalId) {
      (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
      content.intervalId = false;
    }
    content.element.removeEventListener('mousemove', handleEvent.bind(content));
    content.element.removeEventListener('touchmove', handleEvent.bind(content));
    content.element.removeEventListener('mouseup', handleEvent.bind(content));
    content.element.removeEventListener('mouseleave', handleEvent.bind(content));
    content.element.removeEventListener('touchend', handleEvent.bind(content));
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mousedown':
      case 'touchstart':
        startDrag(this, event);
        break;
      case 'mousemove':
      case 'touchmove':
        drag(this, event);
        break;
      case 'mouseup':
      case 'mouseleave':
      case 'touchend':
        endDrag(this, event);
        break;
    }
  };

  function startDrag(content, event) {
    content.dragging = true;
    // listen to drag movements
    initDragging(content);
    content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
    // emit drag start event
    emitSwipeEvents(content, 'dragStart', content.delta, event.target);
  };

  function endDrag(content, event) {
    cancelDragging(content);
    // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
    var dx = parseInt(unify(event).clientX), 
      dy = parseInt(unify(event).clientY);
    
    // check if there was a left/right swipe
    if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
      var s = getSign(dx - content.delta[0]);
      
      if(Math.abs(dx - content.delta[0]) > 30) {
        (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
      }
      
      content.delta[0] = false;
    }
    // check if there was a top/bottom swipe
    if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
    	var y = getSign(dy - content.delta[1]);

    	if(Math.abs(dy - content.delta[1]) > 30) {
      	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
      }

      content.delta[1] = false;
    }
    // emit drag end event
    emitSwipeEvents(content, 'dragEnd', [dx, dy]);
    content.dragging = false;
  };

  function drag(content, event) {
    if(!content.dragging) return;
    // emit dragging event with coordinates
    (!window.requestAnimationFrame) 
      ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
      : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
  };

  function emitDrag(event) {
    emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
  };

  function unify(event) { 
    // unify mouse and touch events
    return event.changedTouches ? event.changedTouches[0] : event; 
  };

  function emitSwipeEvents(content, eventName, detail, el) {
    var trigger = false;
    if(el) trigger = el;
    // emit event with coordinates
    var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
    content.element.dispatchEvent(event);
  };

  function getSign(x) {
    if(!Math.sign) {
      return ((x > 0) - (x < 0)) || +x;
    } else {
      return Math.sign(x);
    }
  };

  window.SwipeContent = SwipeContent;
  
  //initialize the SwipeContent objects
  var swipe = document.getElementsByClassName('js-swipe-content');
  if( swipe.length > 0 ) {
    for( var i = 0; i < swipe.length; i++) {
      (function(i){new SwipeContent(swipe[i]);})(i);
    }
  }
}());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
  if(flexHeader.length > 0) {
    var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
      firstFocusableElement = getMenuFirstFocusable();

    // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
    var focusMenu = false;

    menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
      Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', event.detail);
      menuTrigger.setAttribute('aria-expanded', event.detail);
      if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
      else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    });

    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
          focusMenu = menuTrigger; // move focus to menu trigger when menu is close
          menuTrigger.click();
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
      }
    });

    function getMenuFirstFocusable() {
      var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
        firstFocusable = false;
      for(var i = 0; i < focusableEle.length; i++) {
        if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }

      return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };
  }
}());
// File#: _2_footnotes
// Usage: codyhouse.co/license
(function() {
  var Footnote = function(element) {
    this.element = element;
    this.link = this.element.getElementsByClassName('footnotes__back-link')[0];
    this.contentLink = document.getElementById(this.link.getAttribute('href').replace('#', ''));
    this.initFootnote();
  };

  Footnote.prototype.initFootnote = function() {
    Util.setAttributes(this.contentLink, {
      'aria-label': 'Footnote: '+this.element.getElementsByClassName('js-footnote__label')[0].textContent,
      'data-tooltip-class': 'tooltip--lg tooltip--sticky',
      'data-tooltip-describedby': 'false',
      'title': this.getFootnoteContent(),
    });
    new Tooltip(this.contentLink);
  };

  Footnote.prototype.getFootnoteContent = function() {
    var clone = this.element.cloneNode(true);
    clone.removeChild(clone.getElementsByClassName('footnotes__back-link')[0]);
    return clone.innerHTML;
  };

  //initialize the Footnote objects
  var footnotes = document.getElementsByClassName('js-footnotes__item');
  if( footnotes.length > 0 ) {
    for( var i = 0; i < footnotes.length; i++) {
      (function(i){new Footnote(footnotes[i]);})(i);
    }
  }
}());
// File#: _2_menu-bar
// Usage: codyhouse.co/license
(function() {
  var MenuBar = function(element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, 'menu-bar__item');
    this.mobHideItems = this.element.getElementsByClassName('menu-bar__item--hide');
    this.moreItemsTrigger = this.element.getElementsByClassName('js-menu-bar__trigger');
    initMenuBar(this);
  };

  function initMenuBar(menu) {
    setMenuTabIndex(menu); // set correct tabindexes for menu item
    initMenuBarMarkup(menu); // create additional markup
    checkMenuLayout(menu); // set menu layout
    Util.addClass(menu.element, 'menu-bar--loaded'); // reveal menu

    // custom event emitted when window is resized
    menu.element.addEventListener('update-menu-bar', function(event){
      checkMenuLayout(menu);
      menu.menuInstance.toggleMenu(false, false); // close dropdown
    });

    // keyboard events 
    // open dropdown when pressing Enter on trigger element
    if(menu.moreItemsTrigger.length > 0) {
      menu.moreItemsTrigger[0].addEventListener('keydown', function(event) {
        if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
          menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
          menu.menuInstance.toggleMenu(!Util.hasClass(menu.subMenu, 'menu--is-visible'), true);
        }
      });

      // close dropdown on esc
      menu.subMenu.addEventListener('keydown', function(event) {
        if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) { // close submenu on esc
          menu.menuInstance.toggleMenu(false, true);
        }
      });
    }
    
    // navigate menu items using left/right arrows
    menu.element.addEventListener('keydown', function(event) {
      if( (event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright') ) {
        navigateItems(menu.items, event, 'next');
      } else if( (event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft') ) {
        navigateItems(menu.items, event, 'prev');
      }
    });
  };

  function setMenuTabIndex(menu) { // set tabindexes for the menu items to allow keyboard navigation
    var nextItem = false;
    for(var i = 0; i < menu.items.length; i++ ) {
      if(i == 0 || nextItem) menu.items[i].setAttribute('tabindex', '0');
      else menu.items[i].setAttribute('tabindex', '-1');
      if(i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
      else nextItem = false;
    }
  };

  function initMenuBarMarkup(menu) {
    if(menu.mobHideItems.length == 0 ) { // no items to hide on mobile - remove trigger
      if(menu.moreItemsTrigger.length > 0) menu.element.removeChild(menu.moreItemsTrigger[0]);
      return;
    }

    if(menu.moreItemsTrigger.length == 0) return;

    // create the markup for the Menu element
    var content = '';
    menu.menuControlId = 'submenu-bar-'+Date.now();
    for(var i = 0; i < menu.mobHideItems.length; i++) {
      var item = menu.mobHideItems[i].cloneNode(true),
        svg = item.getElementsByTagName('svg')[0],
        label = item.getElementsByClassName('menu-bar__label')[0];

      svg.setAttribute('class', 'icon menu__icon');
      content = content + '<li role="menuitem"><span class="menu__content js-menu__content">'+svg.outerHTML+'<span>'+label.innerHTML+'</span></span></li>';
    }

    Util.setAttributes(menu.moreItemsTrigger[0], {'role': 'button', 'aria-expanded': 'false', 'aria-controls': menu.menuControlId, 'aria-haspopup': 'true'});

    var subMenu = document.createElement('menu'),
      customClass = menu.element.getAttribute('data-menu-class');
    Util.setAttributes(subMenu, {'id': menu.menuControlId, 'class': 'menu js-menu '+customClass});
    subMenu.innerHTML = content;
    document.body.appendChild(subMenu);

    menu.subMenu = subMenu;
    menu.subItems = subMenu.getElementsByTagName('li');

    menu.menuInstance = new Menu(menu.subMenu); // this will handle the dropdown behaviour
  };

  function checkMenuLayout(menu) { // switch from compressed to expanded layout and viceversa
    var layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(menu.element, 'menu-bar--collapsed', layout == 'collapsed');
  };

  function navigateItems(list, event, direction, prevIndex) { // keyboard navigation among menu items
    event.preventDefault();
    var index = (typeof prevIndex !== 'undefined') ? prevIndex : Util.getIndexInArray(list, event.target),
      nextIndex = direction == 'next' ? index + 1 : index - 1;
    if(nextIndex < 0) nextIndex = list.length - 1;
    if(nextIndex > list.length - 1) nextIndex = 0;
    // check if element is visible before moving focus
    (list[nextIndex].offsetParent === null) ? navigateItems(list, event, direction, nextIndex) : Util.moveFocus(list[nextIndex]);
  };

  function checkMenuClick(menu, target) { // close dropdown when clicking outside the menu element
    if(menu.menuInstance && !menu.moreItemsTrigger[0].contains(target) && !menu.subMenu.contains(target)) menu.menuInstance.toggleMenu(false, false);
  };

  // init MenuBars objects
  var menuBars = document.getElementsByClassName('js-menu-bar');
  if( menuBars.length > 0 ) {
    var j = 0,
      menuBarArray = [];
    for( var i = 0; i < menuBars.length; i++) {
      var beforeContent = getComputedStyle(menuBars[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){menuBarArray.push(new MenuBar(menuBars[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-menu-bar');
      // update Menu Bar layout on resize  
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 150);
      });

      // close menu when clicking outside it
      window.addEventListener('click', function(event){
        menuBarArray.forEach(function(element){
          checkMenuClick(element, event.target);
        });
      });

      function doneResizing() {
        for( var i = 0; i < menuBars.length; i++) {
          (function(i){menuBars[i].dispatchEvent(customEvent)})(i);
        };
      };
    }
  }
}());
// // По клику на кнопку "меню" меняется класс у навигации
// var 
//     bodyElement = document.querySelector('body');
//     menuButton = document.querySelector('.main-header__button');
//     menuList = document.querySelector('.main-header__navigation');

//     menuButton.addEventListener('click', function(event){
//         menuList.classList.toggle('main-header__navigation--show');
//         bodyElement.classList.toggle('body__overflow--hidden');
//     });

// // Скролл

// window.addEventListener('scroll', function(e){
//     if(bodyElement.classList == 'body__overflow--hidden'){
//         return false;
//     } else {
//         var
//         oldScrollPosition = this.oldScroll || 0,
//         newScrollPosition = this.scrollY,
//         isScrollDown = newScrollPosition > oldScrollPosition;

        
//     document.querySelector('.main-header').classList.toggle('main-header--scroll-up', isScrollDown);

//     this.oldScroll = newScrollPosition;
//     }
// });





// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
  var Slideshow = function(opts) {
    this.options = slideshowAssignOptions(Slideshow.defaults , opts);
    this.element = this.options.element;
    this.items = this.element.getElementsByClassName('js-slideshow__item');
    this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
    this.selectedSlide = 0;
    this.autoplayId = false;
    this.autoplayPaused = false;
    this.navigation = false;
    this.navCurrentLabel = false;
    this.ariaLive = false;
    this.moveFocus = false;
    this.animating = false;
    this.supportAnimation = Util.cssSupports('transition');
    this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide'));
    this.animatingClass = 'slideshow--is-animating';
    initSlideshow(this);
    initSlideshowEvents(this);
    initAnimationEndEvents(this);
  };

  Slideshow.prototype.showNext = function() {
    showNewItem(this, this.selectedSlide + 1, 'next');
  };

  Slideshow.prototype.showPrev = function() {
    showNewItem(this, this.selectedSlide - 1, 'prev');
  };

  Slideshow.prototype.showItem = function(index) {
    showNewItem(this, index, false);
  };

  Slideshow.prototype.startAutoplay = function() {
    var self = this;
    if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
      self.autoplayId = setInterval(function(){
        self.showNext();
      }, self.options.autoplayInterval);
    }
  };

  Slideshow.prototype.pauseAutoplay = function() {
    var self = this;
    if(this.options.autoplay) {
      clearInterval(self.autoplayId);
      self.autoplayId = false;
    }
  };

  function slideshowAssignOptions(defaults, opts) {
    // initialize the object options
    var mergeOpts = {};
    mergeOpts.element = (typeof opts.element !== "undefined") ? opts.element : defaults.element;
    mergeOpts.navigation = (typeof opts.navigation !== "undefined") ? opts.navigation : defaults.navigation;
    mergeOpts.autoplay = (typeof opts.autoplay !== "undefined") ? opts.autoplay : defaults.autoplay;
    mergeOpts.autoplayInterval = (typeof opts.autoplayInterval !== "undefined") ? opts.autoplayInterval : defaults.autoplayInterval;
    mergeOpts.swipe = (typeof opts.swipe !== "undefined") ? opts.swipe : defaults.swipe;
    return mergeOpts;
  };

  function initSlideshow(slideshow) { // basic slideshow settings
    // if no slide has been selected -> select the first one
    if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
    slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
    // create an element that will be used to announce the new visible slide to SR
    var srLiveArea = document.createElement('div');
    Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
    slideshow.element.appendChild(srLiveArea);
    slideshow.ariaLive = srLiveArea;
  };

  function initSlideshowEvents(slideshow) {
    // if slideshow navigation is on -> create navigation HTML and add event listeners
    if(slideshow.options.navigation) {
      var navigation = document.createElement('ol'),
        navChildren = '';
      
      navigation.setAttribute('class', 'slideshow__navigation');
      for(var i = 0; i < slideshow.items.length; i++) {
        var className = (i == slideshow.selectedSlide) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"' :  'class="slideshow__nav-item js-slideshow__nav-item"',
          navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
        navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
      }

      navigation.innerHTML = navChildren;
      slideshow.navCurrentLabel = navigation.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
      slideshow.element.appendChild(navigation);
      slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

      navigation.addEventListener('click', function(event){
        navigateSlide(slideshow, event, true);
      });
      navigation.addEventListener('keyup', function(event){
        navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
      });
    }
    // slideshow arrow controls
    if(slideshow.controls.length > 0) {
      slideshow.controls[0].addEventListener('click', function(event){
        event.preventDefault();
        slideshow.showPrev();
        updateAriaLive(slideshow);
      });
      slideshow.controls[1].addEventListener('click', function(event){
        event.preventDefault();
        slideshow.showNext();
        updateAriaLive(slideshow);
      });
    }
    // swipe events
    if(slideshow.options.swipe) {
      //init swipe
      new SwipeContent(slideshow.element);
      slideshow.element.addEventListener('swipeLeft', function(event){
        slideshow.showNext();
      });
      slideshow.element.addEventListener('swipeRight', function(event){
        slideshow.showPrev();
      });
    }
    // autoplay
    if(slideshow.options.autoplay) {
      slideshow.startAutoplay();
      // pause autoplay if user is interacting with the slideshow
      slideshow.element.addEventListener('mouseenter', function(event){
        slideshow.pauseAutoplay();
        slideshow.autoplayPaused = true;
      });
      slideshow.element.addEventListener('focusin', function(event){
        slideshow.pauseAutoplay();
        slideshow.autoplayPaused = true;
      });
      slideshow.element.addEventListener('mouseleave', function(event){
        slideshow.autoplayPaused = false;
        slideshow.startAutoplay();
      });
      slideshow.element.addEventListener('focusout', function(event){
        slideshow.autoplayPaused = false;
        slideshow.startAutoplay();
      });
    }
    // detect if external buttons control the slideshow
    var slideshowId = slideshow.element.getAttribute('id');
    if(slideshowId) {
      var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
      for(var i = 0; i < externalControls.length; i++) {
        (function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
      }
    }
    // custom event to trigger selection of a new slide element
    slideshow.element.addEventListener('selectNewItem', function(event){
      if(event.detail) showNewItem(slideshow, event.detail - 1, false);
    });
  };

  function navigateSlide(slideshow, event, keyNav) { 
    // user has interacted with the slideshow navigation -> update visible slide
    var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
    if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
      slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
      slideshow.moveFocus = true;
      updateAriaLive(slideshow);
    }
  };

  function initAnimationEndEvents(slideshow) {
    // remove animation classes at the end of a slide transition
    for( var i = 0; i < slideshow.items.length; i++) {
      (function(i){
        slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
        slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
      })(i);
    }
  };

  function resetAnimationEnd(slideshow, item) {
    setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
      if(Util.hasClass(item,'slideshow__item--selected')) {
        if(slideshow.moveFocus) Util.moveFocus(item);
        emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
        slideshow.moveFocus = false;
      }
      Util.removeClass(item, 'slideshow__item--slide-out-left slideshow__item--slide-out-right slideshow__item--slide-in-left slideshow__item--slide-in-right');
      item.removeAttribute('aria-hidden');
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass); 
    }, 100);
  };

  function showNewItem(slideshow, index, bool) {
    if(slideshow.animating && slideshow.supportAnimation) return;
    slideshow.animating = true;
    Util.addClass(slideshow.element, slideshow.animatingClass); 
    if(index < 0) index = slideshow.items.length - 1;
    else if(index >= slideshow.items.length) index = 0;
    var exitItemClass = getExitItemClass(bool, slideshow.selectedSlide, index);
    var enterItemClass = getEnterItemClass(bool, slideshow.selectedSlide, index);
    // transition between slides
    if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
    Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
    slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
    if(slideshow.animationOff) {
      Util.addClass(slideshow.items[index], 'slideshow__item--selected');
    } else {
      Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
    }
    // reset slider navigation appearance
    resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
    slideshow.selectedSlide = index;
    // reset autoplay
    slideshow.pauseAutoplay();
    slideshow.startAutoplay();
    // reset controls/navigation color themes
    resetSlideshowTheme(slideshow, index);
    // emit event
    emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
    if(slideshow.animationOff) {
      slideshow.animating = false;
      Util.removeClass(slideshow.element, slideshow.animatingClass);
    }
  };

  function getExitItemClass(bool, oldIndex, newIndex) {
    var className = '';
    if(bool) {
      className = (bool == 'next') ? 'slideshow__item--slide-out-right' : 'slideshow__item--slide-out-left'; 
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--slide-out-left' : 'slideshow__item--slide-out-right';
    }
    return className;
  };

  function getEnterItemClass(bool, oldIndex, newIndex) {
    var className = '';
    if(bool) {
      className = (bool == 'next') ? 'slideshow__item--slide-in-right' : 'slideshow__item--slide-in-left'; 
    } else {
      className = (newIndex < oldIndex) ? 'slideshow__item--slide-in-left' : 'slideshow__item--slide-in-right';
    }
    return className;
  };

  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
    if(slideshow.navigation) {
      Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
      Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
      slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
      slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
    }
  };

  function resetSlideshowTheme(slideshow, newIndex) {
    var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
    if(dataTheme) {
      if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
      if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
    } else {
      if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
      if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
    }
  };

  function emitSlideshowEvent(slideshow, eventName, detail) {
    var event = new CustomEvent(eventName, {detail: detail});
    slideshow.element.dispatchEvent(event);
  };

  function updateAriaLive(slideshow) {
    slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
  };

  function externalControlSlide(slideshow, button) { // control slideshow using external element
    button.addEventListener('click', function(event){
      var index = button.getAttribute('data-index');
      if(!index) return;
      event.preventDefault();
      showNewItem(slideshow, index - 1, false);
    });
  };

  Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
    autoplayInterval: 5000,
    swipe: false
  };

  window.Slideshow = Slideshow;
  
  //initialize the Slideshow objects
  var slideshows = document.getElementsByClassName('js-slideshow');
  if( slideshows.length > 0 ) {
    for( var i = 0; i < slideshows.length; i++) {
      (function(i){
        var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
          autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
          autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
          swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false;
        new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe});
      })(i);
    }
  }
}());
// File#: _3_expandable-img-gallery
// Usage: codyhouse.co/license

(function() {
  var ExpGallery = function(element) {
    this.element = element;
    this.slideshow = this.element.getElementsByClassName('js-exp-lightbox__body')[0];
    this.slideshowList = this.element.getElementsByClassName('js-exp-lightbox__slideshow')[0];
    this.slideshowId = this.element.getAttribute('id')
    this.gallery = document.querySelector('[data-controls="'+this.slideshowId+'"]');
    this.galleryItems = this.gallery.getElementsByClassName('js-exp-gallery__item');
    this.lazyload = this.gallery.getAttribute('data-placeholder');
    initLightboxMarkup(this);
    lazyLoadLightbox(this);
    initSlideshow(this);
    initModal(this);
    initModalEvents(this);
  };

  function initLightboxMarkup(gallery) {
    // create items inside lightbox - modal slideshow
    var slideshowContent = '';
    for(var i = 0; i < gallery.galleryItems.length; i++) {
      var caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption'),
        image = gallery.galleryItems[i].getElementsByTagName('img')[0],
        caption = gallery.galleryItems[i].getElementsByClassName('js-exp-gallery__caption');
      // details
      var src = image.getAttribute('data-src');
      if(!src) src = image.getAttribute('src');
      var altAttr = image.getAttribute('alt')
      altAttr = altAttr ? 'alt="'+altAttr+'"' : '';
      var draggable = gallery.slideshow.getAttribute('data-swipe') == 'on' ? 'draggable="false" ondragstart="return false;"' : '';
      var imgBlock = gallery.lazyload 
        ? '<img data-src="'+src+'" data-loading="lazy" src="'+gallery.lazyload+'" '+altAttr+' '+draggable+'>'
        : '<img src="'+src+'" data-loading="lazy" '+draggable+'>';

      var captionBlock = caption.length > 0
        ? '<figcaption class="exp-lightbox__caption">'+caption[0].textContent+'</figcaption>'
        : '';

      slideshowContent = slideshowContent + '<li class="slideshow__item js-slideshow__item"><figure class="exp-lightbox__media"><div class="exp-lightbox__media-outer"><div class="exp-lightbox__media-inner">'+imgBlock+'</div></div>'+captionBlock+'</li>';
    }
    gallery.slideshowList.innerHTML = slideshowContent;
    gallery.slides = gallery.slideshowList.getElementsByClassName('js-slideshow__item');

    // append the morphing image - we will animate it from the selected slide to the final position (and viceversa)
    var imgMorph = document.createElement("div");
    Util.setAttributes(imgMorph, {'aria-hidden': 'true', 'class': 'exp-lightbox__clone-img-wrapper js-exp-lightbox__clone-img-wrapper', 'data-exp-morph': gallery.slideshowId});
    imgMorph.innerHTML = '<svg><defs><clipPath id="'+gallery.slideshowId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+gallery.slideshowId+'-clip)"></image></svg>';
    document.body.appendChild(imgMorph);
    gallery.imgMorph = document.querySelector('.js-exp-lightbox__clone-img-wrapper[data-exp-morph="'+gallery.slideshowId+'"]');
    gallery.imgMorphSVG = gallery.imgMorph.getElementsByTagName('svg')[0];
    gallery.imgMorphRect = gallery.imgMorph.getElementsByTagName('rect')[0];
    gallery.imgMorphImg = gallery.imgMorph.getElementsByTagName('image')[0];
    
    // append image for zoom in effect
    if(gallery.slideshow.getAttribute('data-zoom') == 'on') {
      var zoomImg = document.createElement("div");
      Util.setAttributes(zoomImg, {'aria-hidden': 'true', 'class': 'exp-lightbox__zoom exp-lightbox__zoom--no-transition js-exp-lightbox__zoom'});
      zoomImg.innerHTML = '<img>';
      gallery.element.appendChild(zoomImg);
      gallery.zoomImg = gallery.element.getElementsByClassName('js-exp-lightbox__zoom')[0];
    }
  };

  function lazyLoadLightbox(gallery) {
    // lazyload media of selected slide/prev slide/next slide
    gallery.slideshow.addEventListener('newItemSelected', function(event){
      // 'newItemSelected' is emitted by the Slideshow object when a new slide is selected
      gallery.selectedSlide = event.detail;
      lazyLoadSlide(gallery);
    });
  };

  function lazyLoadSlide(gallery) {
    setSlideMedia(gallery, gallery.selectedSlide);
    setSlideMedia(gallery, gallery.selectedSlide + 1);
    setSlideMedia(gallery, gallery.selectedSlide - 1);
  };

  function setSlideMedia(gallery, index) {
    if(index < 0) index = gallery.slides.length - 1;
    if(index > gallery.slides.length - 1) index = 0;
    var imgs = gallery.slides[index].querySelectorAll('img[data-src]');
    for(var i = 0; i < imgs.length; i++) {
      imgs[i].src = imgs[i].getAttribute('data-src');
    }
  };

  function initSlideshow(gallery) { 
    if(gallery.slides.length <= 1) {
      hideSlideshowElements(gallery);
      return;
    } 
    var swipe = (gallery.slideshow.getAttribute('data-swipe') && gallery.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
    gallery.slideshowObj = new Slideshow({element: gallery.slideshow, navigation: false, autoplay : false, swipe : swipe});
  };

  function hideSlideshowElements(gallery) { // hide slideshow controls if gallery is composed by one item only
    var slideshowNav = gallery.element.getElementsByClassName('js-slideshow__control');
    if(slideshowNav.length > 0) {
      for(var i = 0; i < slideshowNav.length; i++) Util.addClass(slideshowNav[i], 'is-hidden');
    }
  };

  function initModal(gallery) {
    Util.addClass(gallery.element, 'exp-lightbox--no-transition'); // add no-transition class to lightbox - used to select the first visible slide
    gallery.element.addEventListener('modalIsClose', function(event){ // add no-transition class
      Util.addClass(gallery.element, 'exp-lightbox--no-transition');
      gallery.imgMorph.style = '';
    });
    // trigger modal lightbox
    gallery.gallery.addEventListener('click', function(event){
      openModalLightbox(gallery, event);
    });
  };

  function initModalEvents(gallery) {
    if(gallery.zoomImg) { // image zoom
      gallery.slideshow.addEventListener('click', function(event){
        if(event.target.tagName.toLowerCase() == 'img' && event.target.closest('.js-slideshow__item') && !gallery.modalSwiping) modalZoomImg(gallery, event.target);
      });

      gallery.zoomImg.addEventListener('click', function(event){
        modalZoomImg(gallery, false);
      });

      gallery.element.addEventListener('modalIsClose', function(event){
        modalZoomImg(gallery, false); // close zoom-in image if open
        closeModalAnimation(gallery);
      });
    }

    if(gallery.slideshowObj.options.swipe) { // close gallery when you swipeUp/SwipeDown
      gallery.slideshowObj.element.addEventListener('swipeUp', function(event){
        closeModal(gallery);
      });
      gallery.slideshowObj.element.addEventListener('swipeDown', function(event){
        closeModal(gallery);
      });
    }
    
    if(gallery.zoomImg && gallery.slideshowObj.options.swipe) {
      gallery.slideshowObj.element.addEventListener('swipeLeft', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('swipeRight', function(event){
        gallery.modalSwiping = true;
      });
      gallery.slideshowObj.element.addEventListener('newItemVisible', function(event){
        gallery.modalSwiping = false;
      });
    }
  };

  function openModalLightbox(gallery, event) {
    var item = event.target.closest('.js-exp-gallery__item');
    if(!item) return;
    gallery.selectedSlide = Util.getIndexInArray(gallery.galleryItems, item);
    setSelectedItem(gallery);
    lazyLoadSlide(gallery);
    if(animationSupported) { // start expanding animation
      window.requestAnimationFrame(function(){
        animateSelectedImage(gallery);
        openModal(gallery, item);
      });
    } else { // no expanding animation -> show modal
      openModal(gallery, item);
      Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
    }
  };

  function setSelectedItem(gallery) {
    // if a specific slide was selected -> make sure to show that item first
    var lastSelected = gallery.slideshow.getElementsByClassName('slideshow__item--selected');
    if(lastSelected.length > 0 ) Util.removeClass(lastSelected[0], 'slideshow__item--selected');
    Util.addClass(gallery.slides[gallery.selectedSlide], 'slideshow__item--selected');
    if(gallery.slideshowObj) gallery.slideshowObj.selectedSlide = gallery.selectedSlide;
  };

  function openModal(gallery, item) {
    gallery.element.dispatchEvent(new CustomEvent('openModal', {detail: item}));
    gallery.modalSwiping = false;
  };

  function closeModal(gallery) {
    gallery.modalSwiping = true;
    modalZoomImg(gallery, false);
    gallery.element.dispatchEvent(new CustomEvent('closeModal'));
  };

  function closeModalAnimation(gallery) { // modal is already closing -> start image closing animation
    gallery.selectedSlide = gallery.slideshowObj.selectedSlide;
    // on close - make sure last selected image (of the gallery) is in the viewport
    var boundingRect = gallery.galleryItems[gallery.selectedSlide].getBoundingClientRect();
    if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
      var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo(0, boundingRect.top + windowScrollTop);
    }
    // animate on close
    animateSelectedImage(gallery, true);
  };

  function modalZoomImg(gallery, img) { // toggle zoom-in image
    if(!gallery.zoomImg) return;
    var bool = false;
    if(img) { // open zoom-in image
      gallery.originImg = img;
      gallery.zoomImg.children[0].setAttribute('src', img.getAttribute('src'));
      bool = true;
    }
    (animationSupported) 
      ? requestAnimationFrame(function(){animateZoomImg(gallery, bool)})
      : Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
  };

  function animateZoomImg(gallery, bool) {
    if(!gallery.originImg) return;
    
    var originImgPosition = gallery.originImg.getBoundingClientRect(),
      originStyle = 'translateX('+originImgPosition.left+'px) translateY('+(originImgPosition.top + gallery.zoomImg.scrollTop)+'px) scale('+ originImgPosition.width/gallery.zoomImg.scrollWidth+')',
      finalStyle = 'scale(1)';

    if(bool) {
      gallery.zoomImg.children[0].style.transform = originStyle;
    } else {
      gallery.zoomImg.addEventListener('transitionend', function cb(){
        Util.addClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
        gallery.zoomImg.scrollTop = 0;
        gallery.zoomImg.removeEventListener('transitionend', cb);
      });
    }
    setTimeout(function(){
      Util.removeClass(gallery.zoomImg, 'exp-lightbox__zoom--no-transition');
      Util.toggleClass(gallery.zoomImg, 'exp-lightbox__zoom--is-visible', bool);
      gallery.zoomImg.children[0].style.transform = (bool) ? finalStyle : originStyle;
    }, 50);
  };

  function animateSelectedImage(gallery, bool) { // create morphing image effect
    var imgInit = gallery.galleryItems[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgInitPosition = imgInit.getBoundingClientRect(),
      imgFinal = gallery.slides[gallery.selectedSlide].getElementsByTagName('img')[0],
      imgFinalPosition = imgFinal.getBoundingClientRect();

    // retrieve all animation params
    var scale = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.height/imgInitPosition.height : imgFinalPosition.width/imgInitPosition.width;
    var initHeight = imgFinalPosition.width > imgFinalPosition.height ? imgInitPosition.height : imgFinalPosition.height/scale,
      initWidth = imgFinalPosition.width > imgFinalPosition.height ? imgFinalPosition.width/scale : imgInitPosition.width;

    var initTranslateY = (imgInitPosition.height - initHeight)/2,
      initTranslateX = (imgInitPosition.width - initWidth)/2,
      initTop = imgInitPosition.top + initTranslateY,
      initLeft = imgInitPosition.left + initTranslateX;

    // get final states
    var translateX = imgFinalPosition.left - imgInitPosition.left,
      translateY = imgFinalPosition.top - imgInitPosition.top;

    var finTranslateX = translateX - initTranslateX,
    finTranslateY = translateY - initTranslateY;

    var initScaleX = imgInitPosition.width/initWidth,
      initScaleY = imgInitPosition.height/initHeight,
      finScaleX = 1,
      finScaleY = 1;

    if(bool) { // update params if this is a closing animation
      scale = 1/scale;
      finScaleX = initScaleX;
      finScaleY = initScaleY;
      initScaleX = 1;
      initScaleY = 1;
      finTranslateX = -1*finTranslateX;
      finTranslateY = -1*finTranslateY;
      initTop = imgFinalPosition.top;
      initLeft = imgFinalPosition.left;
      initHeight = imgFinalPosition.height;
      initWidth = imgFinalPosition.width;
    }

    // set initial status
    gallery.imgMorph.setAttribute('style', 'height: '+initHeight+'px; width: '+initWidth+'px; top: '+initTop+'px; left: '+initLeft+'px;');
    gallery.imgMorphSVG.setAttribute('viewbox', '0 0 '+initWidth+' '+initHeight);
    Util.setAttributes(gallery.imgMorphImg, {'xlink:href': imgInit.getAttribute('src'), 'href': imgInit.getAttribute('src')});
    Util.setAttributes(gallery.imgMorphRect, {'style': 'height: '+initHeight+'px; width: '+initWidth+'px;', 'transform': 'translate('+(initWidth/2)*(1 - initScaleX)+' '+(initHeight/2)*(1 - initScaleY)+') scale('+initScaleX+','+initScaleY+')'});

    // reveal image and start animation
    Util.addClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
    Util.addClass(gallery.slideshowList, 'slideshow__content--is-hidden');
    Util.addClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');

    gallery.imgMorph.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(event.propertyName.indexOf('transform') < 0) return;
      Util.removeClass(gallery.element, 'exp-lightbox--no-transition');
      Util.removeClass(gallery.imgMorph, 'exp-lightbox__clone-img-wrapper--is-visible');
      Util.removeClass(gallery.slideshowList, 'slideshow__content--is-hidden');
      gallery.imgMorph.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('style');
      gallery.imgMorphRect.removeAttribute('transform');
      gallery.imgMorphImg.removeAttribute('href');
      gallery.imgMorphImg.removeAttribute('xlink:href');
      Util.removeClass(gallery.galleryItems[gallery.selectedSlide], 'exp-gallery-item-hidden');
      gallery.imgMorph.removeEventListener('transitionend', cb);
    });

    // trigger expanding/closing animation
    gallery.imgMorph.style.transform = 'translateX('+finTranslateX+'px) translateY('+finTranslateY+'px) scale('+scale+')';
    animateRectScale(gallery.imgMorphRect, initScaleX, initScaleY, finScaleX, finScaleY, initWidth, initHeight);
  };

  function animateRectScale(rect, scaleX, scaleY, finScaleX, finScaleY, width, height) {
    var currentTime = null,
      duration =  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--exp-gallery-animation-duration'))*1000 || 300;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      var valX = easeOutQuad(progress, scaleX, finScaleX-scaleX, duration),
        valY = easeOutQuad(progress, scaleY, finScaleY-scaleY, duration);

      rect.setAttribute('transform', 'translate('+(width/2)*(1 - valX)+' '+(height/2)*(1 - valY)+') scale('+valX+','+valY+')');
      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      }
    };

    function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t*(t-2) + b;
    };
    
    window.requestAnimationFrame(animateScale);
  };

  function keyboardNavigateLightbox(gallery, direction) {
    if(!Util.hasClass(gallery.element, 'modal--is-visible')) return;
    if(!document.activeElement.closest('.js-exp-lightbox__body') && document.activeElement.closest('.js-modal')) return
    (direction == 'next') ? gallery.slideshowObj.showNext() : gallery.slideshowObj.showPrev();
  };

  window.ExpGallery = ExpGallery;

  // init ExpGallery objects
  var expGalleries = document.getElementsByClassName('js-exp-lightbox'),
    animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
  if( expGalleries.length > 0 ) {
    var expGalleriesArray = [];
    for( var i = 0; i < expGalleries.length; i++) {
      (function(i){ expGalleriesArray.push(new ExpGallery(expGalleries[i]));})(i);

      // Lightbox gallery navigation with keyboard
      window.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          updateLightbox('next');
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          updateLightbox('prev');
        }
      });

      function updateLightbox(direction) {
        for( var i = 0; i < expGalleriesArray.length; i++) {
          (function(i){keyboardNavigateLightbox(expGalleriesArray[i], direction);})(i);
        };
      };
    }
  }
}());
// File#: _3_thumbnail-slideshow
// Usage: codyhouse.co/license
(function() {
  var ThumbSlideshow = function(element) {
    this.element = element;
    this.slideshow = this.element.getElementsByClassName('slideshow')[0];
    this.slideshowItems = this.slideshow.getElementsByClassName('js-slideshow__item');
    this.carousel = this.element.getElementsByClassName('thumbslide__nav-wrapper')[0];
    this.carouselList = this.carousel.getElementsByClassName('thumbslide__nav-list')[0];
    this.carouselListWrapper = this.carousel.getElementsByClassName('thumbslide__nav')[0];
    this.carouselControls = this.element.getElementsByClassName('js-thumbslide__tb-control');
    // custom obj
    this.slideshowObj = false;
    // thumb properties
    this.thumbItems = false;
    this.thumbOriginalWidth = false;
    this.thumbOriginalHeight = false;
    this.thumbVisibItemsNb = false;
    this.itemsWidth = false;
    this.itemsHeight = false;
    this.itemsMargin = false;
    this.thumbTranslateContainer = false;
    this.thumbTranslateVal = 0;
    // vertical variation
    this.thumbVertical = Util.hasClass(this.element, 'thumbslide--vertical');
    // recursive update 
    this.recursiveDirection = false;
    // drag events 
    this.thumbDragging = false;
    this.dragStart = false;
    // resize
    this.resize = false;
    // image load -> store info about thumb image being loaded
    this.loaded = false;
    initThumbs(this);
    initSlideshow(this);
    checkImageLoad(this);
  };

  function initThumbs(thumbSlider) { // create thumb items
    var carouselItems = '';
    for(var i = 0; i < thumbSlider.slideshowItems.length; i++) {
      var url = thumbSlider.slideshowItems[i].getAttribute('data-thumb'),
        alt = thumbSlider.slideshowItems[i].getAttribute('data-alt');
      if(!alt) alt = 'Image Preview';
      carouselItems = carouselItems + '<li class="thumbslide__nav-item"><img src="'+url+'" alt="'+alt+'">'+'</li>';
    }
    thumbSlider.carouselList.innerHTML = carouselItems;
    if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
    else loadThumbsVerticalLayout(thumbSlider);
  };

  function initThumbsLayout(thumbSlider) {  // set thumbs visible numbers + width
    // evaluate size of single elements + number of visible elements
    thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
    
    var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
      itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
      itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-left')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width'));

    if( !thumbSlider.thumbOriginalWidth) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
      itemWidth = thumbSlider.thumbOriginalWidth;
    }
    // get proper width of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerWidth - 2*containerPadding + itemMargin)/(itemWidth+itemMargin));
    thumbSlider.itemsWidth = ((containerWidth - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsWidth+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) thumbSlider.carouselList.style.width = (thumbSlider.itemsWidth + itemMargin)*thumbSlider.slideshowItems.length+'px';
    setThumbsWidth(thumbSlider);
  };

  function checkImageLoad(thumbSlider) {
    if(!thumbSlider.thumbVertical) { // no need to wait for image load, we already have their width
      updateVisibleThumb(thumbSlider, 0);
      updateThumbControls(thumbSlider);
      initTbSlideshowEvents(thumbSlider);
    } else { // wait for image to be loaded -> need to know the right height
      var image = new Image();
      image.onload = function () {thumbSlider.loaded = true;}
      image.onerror = function () {thumbSlider.loaded = true;}
      image.src = thumbSlider.slideshowItems[i].getAttribute('data-thumb');
    }
  };

  function loadThumbsVerticalLayout(thumbSlider) {
    // this is the vertical layout -> we need to make sure the thumb are loaded before checking the value of their height
    if(thumbSlider.loaded) {
      initThumbsVerticalLayout(thumbSlider);
      updateVisibleThumb(thumbSlider, 0);
      updateThumbControls(thumbSlider);
      initTbSlideshowEvents(thumbSlider);
    } else { // wait for thumbs to be loaded
      setTimeout(function(){
        loadThumbsVerticalLayout(thumbSlider);
      }, 100);
    }
  }

  function initThumbsVerticalLayout(thumbSlider) {
    // evaluate size of single elements + number of visible elements
    thumbSlider.thumbItems = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item');
    
    var itemStyle = window.getComputedStyle(thumbSlider.thumbItems[0]),
      containerStyle = window.getComputedStyle(thumbSlider.carouselListWrapper),
      itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
      itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
      itemRatio = itemWidth/itemHeight,
      itemMargin = parseFloat(itemStyle.getPropertyValue('margin-bottom')),
      containerPadding = parseFloat(containerStyle.getPropertyValue('padding-top')),
      containerWidth = parseFloat(containerStyle.getPropertyValue('width')),
      containerHeight = parseFloat(containerStyle.getPropertyValue('height'));

    if(!flexSupported) containerHeight = parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('height'));
    
    if( !thumbSlider.thumbOriginalHeight ) { // on resize -> use initial width of items to recalculate 
      thumbSlider.thumbOriginalHeight = itemHeight;
      thumbSlider.thumbOriginalWidth = itemWidth;
    } else {
    	resetOriginalSize(thumbSlider);
      itemHeight = thumbSlider.thumbOriginalHeight;
    }
    // get proper height of elements
    thumbSlider.thumbVisibItemsNb = parseInt((containerHeight - 2*containerPadding + itemMargin)/(itemHeight+itemMargin));
    thumbSlider.itemsHeight = ((containerHeight - 2*containerPadding + itemMargin)/thumbSlider.thumbVisibItemsNb) - itemMargin;
    thumbSlider.itemsWidth = thumbSlider.itemsHeight*itemRatio,
    thumbSlider.thumbTranslateContainer = (((thumbSlider.itemsHeight+itemMargin)* thumbSlider.thumbVisibItemsNb));
    thumbSlider.itemsMargin = itemMargin;
    // flexbox fallback
    if(!flexSupported) {
    	thumbSlider.carousel.style.height = (thumbSlider.itemsHeight + itemMargin)*thumbSlider.slideshowItems.length+'px';
      thumbSlider.carouselListWrapper.style.height = containerHeight+'px';
    }
    setThumbsWidth(thumbSlider);
  };

  function setThumbsWidth(thumbSlider) { // set thumbs width
    for(var i = 0; i < thumbSlider.thumbItems.length; i++) {
      thumbSlider.thumbItems[i].style.width = thumbSlider.itemsWidth+"px";
      if(thumbSlider.thumbVertical) thumbSlider.thumbItems[i].style.height = thumbSlider.itemsHeight+"px";
    }

    if(thumbSlider.thumbVertical) {
    	var padding = parseFloat(window.getComputedStyle(thumbSlider.carouselListWrapper).getPropertyValue('padding-left'));
    	thumbSlider.carousel.style.width = (thumbSlider.itemsWidth + 2*padding)+"px";
    	if(!flexSupported) thumbSlider.slideshow.style.width = (parseFloat(window.getComputedStyle(thumbSlider.element).getPropertyValue('width')) - (thumbSlider.itemsWidth + 2*padding) - 10) + 'px';
    }
  };

  function initSlideshow(thumbSlider) { // for the main slideshow, we are using the Slideshow component -> we only need to initialize the object
    var autoplay = (thumbSlider.slideshow.getAttribute('data-autoplay') && thumbSlider.slideshow.getAttribute('data-autoplay') == 'on') ? true : false,
      autoplayInterval = (thumbSlider.slideshow.getAttribute('data-autoplay-interval')) ? thumbSlider.slideshow.getAttribute('data-autoplay-interval') : 5000,
      swipe = (thumbSlider.slideshow.getAttribute('data-swipe') && thumbSlider.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
    thumbSlider.slideshowObj = new Slideshow({element: thumbSlider.slideshow, navigation: false, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe});
  };

  function initTbSlideshowEvents(thumbSlider) {
    // listen for new slide selection -> 'newItemSelected' custom event is emitted each time a new slide is selected
    thumbSlider.slideshowObj.element.addEventListener('newItemSelected', function(event){
      updateVisibleThumb(thumbSlider, event.detail);
    });

    // click on a thumbnail -> update slide in slideshow
    thumbSlider.carouselList.addEventListener('click', function(event){
      if(thumbSlider.thumbDragging) return;
      var selectedOption = event.target.closest('.thumbslide__nav-item');
      if(!selectedOption || Util.hasClass(selectedOption, 'thumbslide__nav-item--active')) return;
      thumbSlider.slideshowObj.showItem(Util.getIndexInArray(thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item'), selectedOption));
    });

    // reset thumbnails on resize
    window.addEventListener('resize', function(event){
    	if(thumbSlider.resize) return;
    	thumbSlider.resize = true;
      window.requestAnimationFrame(resetThumbsResize.bind(thumbSlider));
    });

    // enable drag on thumbnails
    new SwipeContent(thumbSlider.carouselList);
    thumbSlider.carouselList.addEventListener('dragStart', function(event){
      var coordinate =  getDragCoordinate(thumbSlider, event);
      thumbSlider.dragStart = coordinate;
      thumbDragEnd(thumbSlider);
    });
    thumbSlider.carouselList.addEventListener('dragging', function(event){
      if(!thumbSlider.dragStart) return;
      var coordinate =  getDragCoordinate(thumbSlider, event);
      if(thumbSlider.slideshowObj.animating || Math.abs(coordinate - thumbSlider.dragStart) < 20) return;
      Util.addClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
      thumbSlider.thumbDragging = true;
      Util.addClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
      var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
      setTranslate(thumbSlider, translate+'('+(thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart)+'px)');
    });
  };

  function thumbDragEnd(thumbSlider) {
    thumbSlider.carouselList.addEventListener('dragEnd', function cb(event){
      var coordinate = getDragCoordinate(thumbSlider, event);
      thumbSlider.thumbTranslateVal = resetTranslateToRound(thumbSlider, thumbSlider.thumbTranslateVal + coordinate - thumbSlider.dragStart);
      thumbShowNewItems(thumbSlider, false);
      thumbSlider.dragStart = false;
      Util.removeClass(thumbSlider.carouselList, 'thumbslide__nav-list--no-transition');
      thumbSlider.carouselList.removeEventListener('dragEnd', cb);
      setTimeout(function(){
        thumbSlider.thumbDragging = false;
      }, 50);
      Util.removeClass(thumbSlider.element, 'thumbslide__nav-list--dragging');
    });
  };

  function getDragCoordinate(thumbSlider, event) { // return the drag value based on direction of thumbs navugation
    return thumbSlider.thumbVertical ? event.detail.y : event.detail.x;
  }

  function resetTranslateToRound(thumbSlider, value) { // at the ed of dragging -> set translate of coontainer to right value
    var dimension = getItemDimension(thumbSlider);
    return Math.round(value/(dimension+thumbSlider.itemsMargin))*(dimension+thumbSlider.itemsMargin);
  };

  function resetThumbsResize() { // reset thumbs width on resize
    var thumbSlider = this;
    if(!thumbSlider.thumbVertical) initThumbsLayout(thumbSlider);
    else initThumbsVerticalLayout(thumbSlider);
    setThumbsWidth(thumbSlider);
    var dimension = getItemDimension(thumbSlider);
    // reset the translate value of the thumbs container as well
    if( (-1)*thumbSlider.thumbTranslateVal % (dimension + thumbSlider.itemsMargin) > 0 ) {
      thumbSlider.thumbTranslateVal = -1 * parseInt(((-1)*thumbSlider.thumbTranslateVal)/(dimension + thumbSlider.itemsMargin)) * (dimension + thumbSlider.itemsMargin); 
    	thumbShowNewItems(thumbSlider, false);
    }
    thumbSlider.resize = false;
  };

  function thumbShowNewItems(thumbSlider, direction) { // when a new slide is selected -> update position of thumbs navigation
    var dimension = getItemDimension(thumbSlider);
    if(direction == 'next') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal - thumbSlider.thumbTranslateContainer;
    else if(direction == 'prev') thumbSlider.thumbTranslateVal = thumbSlider.thumbTranslateVal + thumbSlider.thumbTranslateContainer;
    // make sure translate value is correct
    if(-1*thumbSlider.thumbTranslateVal >= (thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin)) thumbSlider.thumbTranslateVal = -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin));
    if(thumbSlider.thumbTranslateVal > 0) thumbSlider.thumbTranslateVal = 0;

    var translate = thumbSlider.thumbVertical ? 'translateY' : 'translateX';
    setTranslate(thumbSlider, translate+'('+thumbSlider.thumbTranslateVal+'px)');
    updateThumbControls(thumbSlider);
  };

  function updateVisibleThumb(thumbSlider, index) { // update selected thumb
    // update selected thumbnails
    var selectedThumb = thumbSlider.carouselList.getElementsByClassName('thumbslide__nav-item--active');
    if(selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'thumbslide__nav-item--active');
    Util.addClass(thumbSlider.thumbItems[index], 'thumbslide__nav-item--active');
    // update carousel translate value if new thumb is not visible
    recursiveUpdateThumb(thumbSlider, index);
  };

  function recursiveUpdateThumb(thumbSlider, index) { // recursive function used to update the position of thumbs navigation (eg when going from last slide to first one)
    var dimension = getItemDimension(thumbSlider);
    if( ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) || ( index*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal <= 0 && thumbSlider.thumbTranslateVal < 0) ) {
      var increment = ((index + 1 - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal >= 0) ? 1 : -1;
      if( !thumbSlider.recursiveDirection || thumbSlider.recursiveDirection == increment) {
        thumbSlider.thumbTranslateVal = -1 * increment * (dimension + thumbSlider.itemsMargin) + thumbSlider.thumbTranslateVal;
        thumbSlider.recursiveDirection = increment;
        recursiveUpdateThumb(thumbSlider, index);
      } else {
        thumbSlider.recursiveDirection = false;
        thumbShowNewItems(thumbSlider, false);
      }
    } else {
      thumbSlider.recursiveDirection = false;
      thumbShowNewItems(thumbSlider, false);
    }
  }

  function updateThumbControls(thumbSlider) { // reset thumb controls style
    var dimension = getItemDimension(thumbSlider);
    Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-start', (thumbSlider.thumbTranslateVal != 0));
    Util.toggleClass(thumbSlider.carouselListWrapper, 'thumbslide__nav--scroll-end', (thumbSlider.thumbTranslateVal != -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))) && (thumbSlider.thumbItems.length > thumbSlider.thumbVisibItemsNb));
    if(thumbSlider.carouselControls.length == 0) return;
    Util.toggleClass(thumbSlider.carouselControls[0], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == 0));
    Util.toggleClass(thumbSlider.carouselControls[1], 'thumbslide__tb-control--disabled', (thumbSlider.thumbTranslateVal == -1*((thumbSlider.thumbItems.length - thumbSlider.thumbVisibItemsNb)*(dimension + thumbSlider.itemsMargin))));
  };

  function getItemDimension(thumbSlider) {
    return thumbSlider.thumbVertical ? thumbSlider.itemsHeight : thumbSlider.itemsWidth;
  }

  function setTranslate(thumbSlider, translate) {
    thumbSlider.carouselList.style.transform = translate;
    thumbSlider.carouselList.style.msTransform = translate;
  };

  function resetOriginalSize(thumbSlider) {
    if( !Util.cssSupports('color', 'var(--var-name)') ) return;
    var thumbWidth = parseInt(getComputedStyle(thumbSlider.element).getPropertyValue('--thumbslide-thumbnail-auto-size'));
    if(thumbWidth == thumbSlider.thumbOriginalWidth) return;
    thumbSlider.thumbOriginalHeight = parseFloat((thumbSlider.thumbOriginalHeight)*(thumbWidth/thumbSlider.thumbOriginalWidth));
  	thumbSlider.thumbOriginalWidth = thumbWidth;
  };
  
  //initialize the ThumbSlideshow objects
  var thumbSlideshows = document.getElementsByClassName('js-thumbslide'),
    flexSupported = Util.cssSupports('align-items', 'stretch');
  if( thumbSlideshows.length > 0 ) {
    for( var i = 0; i < thumbSlideshows.length; i++) {
      (function(i){
        new ThumbSlideshow(thumbSlideshows[i]);
      })(i);
    }
  }
}());