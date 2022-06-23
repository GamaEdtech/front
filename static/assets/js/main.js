function generateSlider () {
    $('.owl-carousel').owlCarousel({
        rtl:true,
        items:1,
        merge:true,
        loop:true,
        margin:10,
        video:true,
        videoHeight:100,
        videoWidth:400,
        lazyLoad:false,
        center:true,
        responsive:{
            480:{
                items:1
            },
            600:{
                items:1
            }
        }
    })
}