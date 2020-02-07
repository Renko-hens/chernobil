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




