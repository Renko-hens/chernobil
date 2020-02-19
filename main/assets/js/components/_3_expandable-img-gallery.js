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