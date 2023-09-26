let button = document.querySelector(".layaout__menu-toggle");

let iconMenu = document.querySelector(".fa-bars");
let iconClose = document.querySelector(".fa-xmark");

let aside = document.querySelector(".layaout__aside");


document.addEventListener("DOMContentLoaded", (event) => {


    button.addEventListener("click", (event) => {
        let visible = document.querySelector(".layaout__aside--visible");

        if (!visible) {
            aside.classList.add("layaout__aside--visible");
            iconMenu.style.opacity = "0";
            iconClose.style.opacity = "1";
        }
        else {
            aside.classList.remove("layaout__aside--visible");
            iconMenu.style.opacity = "1";
            iconClose.style.opacity = "0";
        }
    });



});

window.addEventListener("resize", (event) => {

    aside.classList.remove("layaout__aside--visible");
    iconMenu.style.opacity = "1";
    iconClose.style.opacity = "0";

});