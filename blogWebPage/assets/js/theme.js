(function ($) {
  "use strict";

  // Mobile Menu
  $(".mobile-menu nav").meanmenu({
    meanScreenWidth: "991",
    meanMenuContainer: ".mobile-menu",
    meanMenuOpen: "<span></span> <span></span> <span></span>",
    onePage: false,
  });

  // sticky
  var wind = $(window);
  var sticky = $("#sticky-header");
  wind.on("scroll", function () {
    var scroll = wind.scrollTop();
    if (scroll < 100) {
      sticky.removeClass("sticky");
    } else {
      sticky.addClass("sticky");
    }
  });

  // Loder  //
  $(function () {
    $("body").addClass("loaded");
  });

  // Script nav
  $(".team-share").click(function () {
    $(this).siblings(".team-social-icon").toggleClass("active");
  });

  //======< scrollcue js >======
  $(function () {
    scrollCue.init({
      duration: 2000,
      interval: -0.7,
      percentage: 0.9,
      smartSpeed: 500,
    });
  });

  // testimonial Active
  $(".testimonial_list").owlCarousel({
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    dots: true,
    nav: false,
    margin: 30,
    navText: [
      "<i class='fa fa-long-arrow-left''></i>",
      "<i class='fa fa-long-arrow-right''></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1000: {
        items: 2,
      },
      1920: {
        items: 2,
      },
    },
  });

  //curseer animation

  var curser = document.querySelector(".curser");
  var curser2 = document.querySelector(".curser2");
  document.addEventListener("mousemove", function (e) {
    curser.style.cssText = curser2.style.cssText =
      "left: " + e.clientX + "px; top: " + e.clientY + "px;";
  });

  // counterUp
  $(".counter").counterUp({
    delay: 10,
    time: 1000,
  });

  // Venubox

  $(".venobox").venobox({
    numeratio: true,

    infinigall: true,
  });

  if ($(".prgoress_indicator path").length) {
    var progressPath = document.querySelector(".prgoress_indicator path");
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "none";
    progressPath.style.strokeDasharray = pathLength + " " + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "stroke-dashoffset 10ms linear";
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
    };
    updateProgress();
    $(window).on("scroll", updateProgress);
    var offset = 250;
    var duration = 550;
    jQuery(window).on("scroll", function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery(".prgoress_indicator").addClass("active-progress");
      } else {
        jQuery(".prgoress_indicator").removeClass("active-progress");
      }
    });
    jQuery(".prgoress_indicator").on("click", function (event) {
      event.preventDefault();
      jQuery("html, body").animate({ scrollTop: 0 }, duration);
      return false;
    });
  }

  jQuery(document).ready(function ($) {
    "use strict";

    // =======< accordion js >========
    $(".accordion > li:eq(0) a").addClass("active").next().slideDown();
    $(".accordion a").on("click", function (j) {
      var dropDown = $(this).closest("li").find("p");

      $(this).closest(".accordion").find("p").not(dropDown).slideUp();

      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this).closest(".accordion").find("a.active").removeClass("active");
        $(this).addClass("active");
      }

      dropDown.stop(false, true).slideToggle();

      j.preventDefault();
    });

    //=====< barfiller script >====
    $("#bar1").barfiller({
      duration: 7000,
    });
    $("#bar2").barfiller({
      duration: 7000,
    });
    $("#bar3").barfiller({
      duration: 7000,
    });

    //======< Custom Tab >======
    $(".tab ul.tabs").addClass("active").find("> li:eq(0)").addClass("current");

    $(".tab ul.tabs li a").on("click", function (g) {
      var tab = $(this).closest(".tab"),
        index = $(this).closest("li").index();

      tab.find("ul.tabs > li").removeClass("current");
      $(this).closest("li").addClass("current");

      tab
        .find(".tab_content")
        .find("div.tabs_item")
        .not("div.tabs_item:eq(" + index + ")")
        .slideUp();
      tab
        .find(".tab_content")
        .find("div.tabs_item:eq(" + index + ")")
        .slideDown();

      g.preventDefault();
    });
  });

  // <!--jave script -->

  $(window).on("scroll", function () {
    var scrolled = $(window).scrollTop();
    if (scrolled > 300) $(".go-top").addClass("active");
    if (scrolled < 300) $(".go-top").removeClass("active");
  });

  $(".go-top").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: "0",
      },
      1200
    );
  });

  $(".circle_percent").each(function () {
    var $this = $(this),
      $dataV = $this.data("percent"),
      $dataDeg = $dataV * 3.6,
      $round = $this.find(".round_per");
    $round.css("transform", "rotate(" + parseInt($dataDeg + 180) + "deg)");
    $this.append(
      '<div class="circle_inbox"><span class="percent_text"></span></div>'
    );
    $this.prop("Counter", 0).animate(
      {
        Counter: $dataV,
      },
      {
        duration: 2000,
        easing: "swing",
        step: function (now) {
          $this.find(".percent_text").text(Math.ceil(now) + "%");
        },
      }
    );
    if ($dataV >= 51) {
      $round.css("transform", "rotate(" + 360 + "deg)");
      setTimeout(function () {
        $this.addClass("percent_more");
      }, 1000);
      setTimeout(function () {
        $round.css("transform", "rotate(" + parseInt($dataDeg + 180) + "deg)");
      }, 1000);
    }
  });

  ("use strict");
  jQuery(document).ready(function (o) {
    0 < o(".offset-side-bar").length &&
      o(".offset-side-bar").on("click", function (e) {
        e.preventDefault(),
          e.stopPropagation(),
          o(".cart-group").addClass("isActive");
      }),
      0 < o(".close-side-widget").length &&
        o(".close-side-widget").on("click", function (e) {
          e.preventDefault(), o(".cart-group").removeClass("isActive");
        }),
      0 < o(".navSidebar-button").length &&
        o(".navSidebar-button").on("click", function (e) {
          e.preventDefault(),
            e.stopPropagation(),
            o(".info-group").addClass("isActive");
        }),
      0 < o(".close-side-widget").length &&
        o(".close-side-widget").on("click", function (e) {
          e.preventDefault(), o(".info-group").removeClass("isActive");
        }),
      o("body").on("click", function (e) {
        o(".info-group").removeClass("isActive"),
          o(".cart-group").removeClass("isActive");
      }),
      o(".xs-sidebar-widget").on("click", function (e) {
        e.stopPropagation();
      }),
      0 < o(".xs-modal-popup").length &&
        o(".xs-modal-popup").magnificPopup({
          type: "inline",
          fixedContentPos: !2,
          fixedBgPos: !0,
          overflowY: "auto",
          closeBtnInside: !2,
          callbacks: {
            beforeOpen: function () {
              this.st.mainClass = "my-mfp-slide-bottom xs-promo-popup";
            },
          },
        });
  });

  /*  Cart Plus Minus Button
    /*----------------------------------------*/

  $(".ctnbutton").on("click", function () {
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.hasClass("inc")) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 1) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 1;
      }
    }
    $button.parent().find("input").val(newVal);
  });
})(jQuery);
