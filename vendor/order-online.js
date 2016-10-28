$(function() {
  setTimeout(initializeOrderOnline, 1000);

  function initializeOrderOnline() {
    var w = window;
    var d = document;
    var s = 'script';
    var id = 'glf-embedder-js';
    var h = 'https://www.foodbooking.com/';
    var bid = 'order-online-btn';
    var cuid = '8b161339-3e9b-47f0-9aa1-3242481db243';

    var js,fjs=d.getElementsByTagName(s)[0], l=function(){
      glfWidget(h,[bid],cuid);
      d.getElementById(bid).removeAttribute('id');
    }, b=function(s){
      s.addEventListener?s.addEventListener('load',l,false):s.attachEvent("onload", l);
    };
    if(!(js=d.getElementById(id))){
      js=d.createElement(s);
      js.id=id;
      js.src=h+"widget/js/ewm.js";
      b(js);fjs.parentNode.insertBefore(js,fjs);
    }else if(!w.glfWidget) b(js); else l();
  }
});
