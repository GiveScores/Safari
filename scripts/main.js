(function() {
  var $ = jQuery;
  var vote = $('.vote');
  var feedback = $('.feedback');
  var userVote = 0;

  var overalScore = 2.5;

  var quote = {
    text: "\"The smallest act of kindness is worth more than the grandest intention he smallest act of kindness is worth more\"",
    author: "ko bi drugi"
  };

  var dataBaseApi = "http://45.55.193.78/api";
  var googleApiKey = 'AIzaSyBZg_6uYBHzANuJRkTBpdKshQgnP3K4diw';
  var siteUrl = "";

  function validateEmail (email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
  }

  $('.gs-link').click(function() {
    window.open('http://givescores.com');
  });


  var storedEmail, storedOption, storedDuration, storedLang, showLogin = true;

  if(localStorage.showLogin == "true" || !localStorage.showLogin) {
    showLogin = true;
  } else {
    showLogin = false;
    $(".loggedout").hide();
    $(".vote").show();

  }

  var userEmail = localStorage.userEmail;
  if(userEmail != null && userEmail != "") {
    storedEmail = userEmail;
    vote.hide();
    $('.loader').show();
    var siteUrl = getActiveTabUrl();
    $.post(dataBaseApi + '/stats', {
      url: siteUrl,
      userEmail: storedEmail
    }, function(res) {
      $('.loader').hide();
      if('error' in res) {
        $('.error .error-text').text(res.error);
        $('.loader').hide();
        $('.error').show();
      } else {
        userVote = res.vote;
        if(res.vote) {
          showFeedback(res.overalScore, res.quote);
        } else {
          vote.show();
        }
      }
    });
  } else if(showLogin) {
    storedEmail = "";
    var tempEmail = localStorage.tempMail;
    $(".loggedout").siblings().hide();
    $(".loggedout").show();
    $("#loginEmail").val(tempEmail);
  } else {
    storedEmail = "";
    if(localStorage.url == getActiveTabUrl()) {
      if(localStorage.userVote) {
        $(".vote").siblings().hide();
        $(".vote").show();
        var fullStarsNumber = Math.floor(localStorage.userVote);
        var halfStarsNumber = (localStorage.userVote - Math.floor(localStorage.userVote) ) / 0.5;

        //here i need to set score based on vote
        if(fullStarsNumber === 0) fullStarsNumber = '';
        if(halfStarsNumber === 0) halfStarsNumber = '';
        else halfStarsNumber = 'half';
        $("#star" + fullStarsNumber + halfStarsNumber).prop('checked', true);
      } else {
        $(".vote").siblings().hide();
        $(".vote").show();
      }
    } else {
      $(".vote").siblings().hide();
      $(".vote").show();
    }
  }


// chrome.storage.local.get('lang', function(result) {
  if(localStorage.lang != null) {
    storedLang = localStorage.lang;
    $(".flag").removeClass("flagActive");
    $("#" + storedLang.toString()).addClass("flagActive");
    translateInterface(storedLang);
  } else {
    storedLang = "uk";
  }
// });


// chrome.storage.local.get('duration', function(result) {
  if(localStorage.duration != null) {
    storedDuration = localStorage.duration;
    $("#seconds").val(storedDuration);
  } else {
    storedDuration = 3;
    $("#seconds").val("3");
  }
// });

// chrome.storage.local.get('popupOption', function(result) {
  if(localStorage.popupOption != null) {
    storedOption = localStorage.popupOption;
    $("input[name=popupOption][value=" + storedOption + "]").prop("checked", true);
  } else {
    $("input[name=popupOption][value=random]").prop("checked", true);
  }
// });

  $('.thanks .voteButton').click(function() {
    $('.thanks').hide();
    vote.show();
  });


  $('.notNowButton1').click(function() {
    $('.loggedout').hide();
    localStorage.showLogin = "false";
    showLogin = false;
    vote.show();
  });

  $('.notNowButton2').click(function() {
    $('.register').hide();
    localStorage.showLogin = "false";
    showLogin = false;
    vote.show();
  });

  $(".showRegisterMenu").click(function() {
    $('.loggedout').hide();
    $('.register').show();
    $('#regsubheader').removeClass("error2");
    $('#regsubheader').addClass("subheader");
    $('#regsubheader').text(langs[storedLang].tRegNow);
    $('#regsubheader').show();
  });

  $(".loginButton").click(function() {
    var userEmail = $('#loginEmail').val();
    var password = $('#loginPass').val();

    if(userEmail != "" && password != "") {
      $.post(dataBaseApi + '/login', {
        email: userEmail,
        password: password
      }).done(
        function(data) {
          if(data === 'ok') {
            // chrome.storage.local.set({'userEmail': userEmail});
            localStorage.userEmail = userEmail;
            storedEmail = userEmail;
            $('#logsubheader').removeClass("error2");
            $('#logsubheader').addClass("subheader");
            $(".loggedout").hide();
            $("#logsubheader").text(langs[storedLang].tLoginIf);
            $('.vote').show();
            $('#loginEmail').val("");
            $('#loginPass').val("");
          } else {
            $("#logsubheader").text(langs[storedLang].tUserNotFound);

            $('#logsubheader').removeClass("subheader");
            $('#logsubheader').addClass("error2");
          }

        }).fail(function(xhr, status, error) {
        $("#logsubheader").text(langs[storedLang].tSomething);
        $('#logsubheader').removeClass("subheader");
        $('#logsubheader').addClass("error2");
      });
    }
  });

  $('.registerButton').click(function(e) {
    if(validateEmail($('#registerEmail').val())) {
      var userEmail = $('#registerEmail').val();
      var password = $('#registerPass').val();
      if(userEmail != "" && password != "") {
        $.post(dataBaseApi + '/register', {
          email: userEmail,
          password: password
        }).done(
          function(data) {
            if(data.message === 'User successfuly registered') {
              localStorage.userEmail = userEmail;
              storedEmail = userEmail;
              $('#regsubheader').removeClass("error2");
              $('#regsubheader').addClass("subheader");
              $(".register").hide();
              $('.inputDiv').text(userEmail);
              $('.thanks').show();
              $('#registerEmail').val("");
              $('#registerPass').val("");
            } else {
              $("#regsubheader").text(langs[storedLang].tSomething);
              $('#regsubheader').removeClass("subheader");
              $('#regsubheader').addClass("error2");
            }

          }).fail(function(xhr, status, error) {
          $("#regsubheader").text(langs[storedLang].tSomething);
          $('#regsubheader').removeClass("subheader");
          $('#regsubheader').addClass("error2");
        });
      } else {
        $("#regsubheader").text(langs[storedLang].tNope);
        $('#regsubheader').removeClass("subheader");
        $('#regsubheader').addClass("error2");
      }
    } else {
      $("#regsubheader").text(langs[storedLang].tNope);
      $("#regsubheader").text("Nope, email adress is not valid :( please try again");
      $('#regsubheader').removeClass("subheader");
      $('#regsubheader').addClass("error2");
    }

  });


  $('.voteInput').on('change', function() {
    userVote = $('.voteInput:checked').val();
    $(".overalScore").empty();
    vote.hide();
    $('.feedback').hide();
    $('.loader').show();

    var fullStarsNumber = Math.floor(userVote);
    var halfStarsNumber = ( userVote - Math.floor(userVote) ) / 0.5;

    var i;
    //here i need to set score based on vote
    if(fullStarsNumber === 0) fullStarsNumber = '';
    if(halfStarsNumber === 0) halfStarsNumber = '';
    else halfStarsNumber = 'half';
    $("#fb_star" + fullStarsNumber + halfStarsNumber).prop('checked', true);

    // chrome.tabs.getSelected(null, function(tab) {
    siteUrl = getActiveTabUrl();
    // chrome.storage.local.set({'userVote': userVote, 'url': siteUrl});
    localStorage.userVote = userVote;
    localStorage.url = siteUrl;
    $.post(dataBaseApi + '/scores', {
        url: siteUrl,
        language: storedLang,
        score: userVote,
        userEmail: storedEmail
      },
      function(data, status) {
        if('error' in data) {
          $('.error .error-text').text(data.error);
          $('.loader').hide();
          $('.error').show();
        } else {
          var overalScore = (Math.round(data.overalScore * 2) / 2).toFixed(1);
          $(".overalScore").empty();
          var fullStarsNumber = Math.floor(overalScore);
          var halfStarsNumber = ( overalScore - Math.floor(overalScore) ) / 0.5;
          var baseStarsNumber = 5 - Math.round(overalScore);
          quote = data.quote;
          var i = 0;
          for(i = 0; i < fullStarsNumber; i++) {
            $(".overalScore").append("<span class='fa-stack'><i class='fa fa-fw fa-lg fa-star star-active  fa-stack-1x'></i></span>");
          }
          for(i = 0; i < halfStarsNumber; i++) {
            $(".overalScore").append("<span class='fa-stack '><i class='fa fa-fw fa-lg fa-star star-base  fa-stack-1x'></i><i class='fa fa-fw fa-lg fa-star-half fa-stack-1x'></i></span>");
          }

          for(i = 0; i < baseStarsNumber; i++) {
            $(".overalScore").append("<span class='fa-stack '><i class='fa fa-fw fa-lg fa-star star-base  fa-stack-1x'></i></span>");
          }
          $('.quote .quoteText').html("\"" + quote.text + "\"");
          $('.quote .quoteAuthor').html(quote.author);
          $('.loader').hide();
          feedback.show();
          var quotePosition = $('.feedback .quote').offset(),
            quoteHeight = $('.quote').height();
          $('body').height(quotePosition.top + quoteHeight);
        }
      });
  });


// });

  function showFeedback (dataOveralScore, dataQuote) {
    var fullStarsNumber = Math.floor(userVote);
    var halfStarsNumber = ( userVote - Math.floor(userVote) ) / 0.5;


    var i;
    //here i need to set score based on vote
    if(fullStarsNumber === 0) fullStarsNumber = '';
    if(halfStarsNumber === 0) halfStarsNumber = '';
    else halfStarsNumber = 'half';

    $("#fb_star" + fullStarsNumber + halfStarsNumber).prop('checked', true);


    var overalScore = (Math.round(dataOveralScore * 2) / 2).toFixed(1);
    $(".overalScore").empty();
    fullStarsNumber = Math.floor(overalScore);
    halfStarsNumber = ( overalScore - Math.floor(overalScore) ) / 0.5;
    baseStarsNumber = 5 - Math.round(overalScore);
    var quote = dataQuote;

    var i = 0;
    for(i = 0; i < fullStarsNumber; i++) {
      $(".overalScore").append("<span class='fa-stack'><i class='fa fa-fw fa-lg fa-star star-active  fa-stack-1x'></i></span>");
    }
    for(i = 0; i < halfStarsNumber; i++) {
      $(".overalScore").append("<span class='fa-stack '><i class='fa fa-fw fa-lg fa-star star-base  fa-stack-1x'></i><i class='fa fa-fw fa-lg fa-star-half fa-stack-1x'></i></span>");
    }

    for(i = 0; i < baseStarsNumber; i++) {
      $(".overalScore").append("<span class='fa-stack '><i class='fa fa-fw fa-lg fa-star star-base  fa-stack-1x'></i></span>");
    }
    $('.quote .quoteText').html("\"" + quote.text + "\"");
    $('.quote .quoteAuthor').html(quote.author);
    $('.loader').hide();
    feedback.show();
    var quotePosition = $('.feedback .quote').offset(),
      quoteHeight = $('.quote').height();
    $('body').height(quotePosition.top + quoteHeight);
  }


  $('.userButton').on('click', function () {
    if (storedEmail != "") {
      $('.vote').hide();
      $('.user').show();
      $('.userEmail').text(storedEmail);
      $(".feedback").hide();
    } else {
      $('.loggedout').siblings().hide();
      $("#logsubheader").text("Login if you are already registered:");
      $('#logsubheader').removeClass("error2");
      $('#logsubheader').addClass("subheader");
      $('.loggedout').show();
    }
  });

  $(".logoutButton").on('click', function () {
    localStorage.removeItem("userEmail");
    $('.loggedout').siblings().hide();
    $("#logsubheader").text("Login if you are already registered:");
    $('#logsubheader').removeClass("error2");
    $('#logsubheader').addClass("subheader");
    $('.loggedout').show();
  });


  $('.vote .inviteButton').click(function () {
    $('.vote').hide();
    $('.invite').show();
  });
  $('.invite .submitFriendsButton').click(function() {
    $.post(dataBaseApi + '/invite', {
      friends: $('#inviteMails').val()
    }, function(res) {
      $('.invite').hide();
      $('.vote').show();
    });
  });
   $('.backFriendsButton').click(function() {
      $('.invite').hide();
      $('.vote').show();
  });


 
    function fbShare() {
        $.post(dataBaseApi + '/social', {
            network: 'fb'
        });
        var shortUrl = '';

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=' + googleApiKey,
            data: '{ longUrl: "' + siteUrl + '" }',
            dataType: "json",
            success: function (res) {
                shortUrl = res.id;
                openTabInSafari('https://www.facebook.com/sharer/sharer.php?u='+shortUrl, 'sharer', 'top=200,left=200,toolbar=0,status=0,width=550,height=350');
        }
        });

    }

    function twShare() {
        $.post(dataBaseApi + '/social', {
            network: 'tw'
        });
        var shortUrl = '';

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=' + googleApiKey,
            data: '{ longUrl: "' + siteUrl + '" }',
            dataType: "json",
            success: function (res) {
                shortUrl = res.id;
                var status;
                if(userVote == 1){
                    status = userVote + ' star to ' + shortUrl + ', rate anything with GiveScores.com';
                }else{
                    status = userVote + ' stars to ' + shortUrl + ', rate anything with GiveScores.com';
                }
                openTabInSafari('http://twitter.com/intent/tweet?status=' + status, 'sharer', 'top=200,left=200,toolbar=0,status=0,width=550,height=350');

            }
        });
    }

    function gpShare() {
        $.post(dataBaseApi + '/social', {
            network: 'gp'
        });
        var shortUrl = '';

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=' + googleApiKey,
            data: '{ longUrl: "' + siteUrl + '" }',
            dataType: "json",
            success: function (res) {
                shortUrl = res.id;
                var sharelink = "https://plus.google.com/share?url=" + shortUrl;
                openTabInSafari(sharelink, 'sharer', 'top=200,left=200,toolbar=0,status=0,width=550,height=350');

            }
        });
    }

    function liShare() {
        $.post(dataBaseApi + '/social', {
            network: 'li'
        });

        var shortUrl = '';

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=' + googleApiKey,
            data: '{ longUrl: "' + siteUrl + '" }',
            dataType: "json",
            success: function (res) {
                shortUrl = res.id;
                var summary;
                if(userVote == 1){
                    summary = userVote + ' star to ' + shortUrl + ', rate anything with GiveScores.com';
                }else{
                    summary = userVote + ' stars to ' + shortUrl + ', rate anything with GiveScores.com';
                }
                var sharelink = "https://www.linkedin.com/shareArticle?mini=true&url=" + shortUrl + "&summary=" + summary;
                openTabInSafari(sharelink, 'sharer', 'top=200,left=200,toolbar=0,status=0,width=550,height=350');

            }
        });
    }

  function translateInterface (lang) {
    $(".tRegister").text(langs[lang].tRegister);
    $(".tProvidedBy").text(langs[lang].tProvidedBy);
    $(".tRate").text(langs[lang].tRate);
    $(".tBecause").text(langs[lang].tBecause);
    $(".tInvite").text(langs[lang].tInvite);
    $(".tOverall").text(langs[lang].tOverall);
    $(".tNotNow").text(langs[lang].tNotNow);
    $(".tWelcome").text(langs[lang].tWelcome);
    $(".tThankYou").text(langs[lang].tThankYou);
    $(".tVote").text(langs[lang].tVote);
    $(".tSpread").text(langs[lang].tSpread);
    $(".tInviteAsMany").text(langs[lang].tInviteAsMany);
    $(".tSubmit").text(langs[lang].tSubmit);
    $(".tRegTo").text(langs[lang].tRegTo);
    $(".tBack").text(langs[lang].tBack);
    $(".tLanguages").text(langs[lang].tLanguages);
    $(".tPopup").text(langs[lang].tPopup);
    $(".tEvery").text(langs[lang].tEvery);
    $(".tRandom").text(langs[lang].tRandom);
    $(".tOnClick").text(langs[lang].tOnClick);
    $(".tOnScreen").text(langs[lang].tOnScreen);
    $(".tSeconds").text(langs[lang].tSeconds);
    $(".tDone").text(langs[lang].tDone);
    $(".full[for=star5]").prop("title", langs[lang].s5);
    $(".half[for=star4half]").prop("title", langs[lang].s45);
    $(".full[for=star4]").prop("title", langs[lang].s4);
    $(".half[for=star3half]").prop("title", langs[lang].s35);
    $(".full[for=star3]").prop("title", langs[lang].s3);
    $(".half[for=star2half]").prop("title", langs[lang].s25);
    $(".full[for=star2]").prop("title", langs[lang].s2);
    $(".half[for=star1half]").prop("title", langs[lang].s15);
    $(".full[for=star1]").prop("title", langs[lang].s1);
    $(".half[for=starhalf]").prop("title", langs[lang].s05);

  }

  $('.fb').click(function() {
    fbShare();
  });

  $('.tw').click(function() {
    twShare();
  });

  $('.gp').click(function() {
    gpShare();
  });

  $('.lin').click(function() {
    liShare();
  });

  $(".settingsButton").click(function() {
    $("#settings").show();
    $("#settings").siblings().hide();
  });

  $(".flag").click(function() {
    $(this).siblings().removeClass("flagActive");
    $(this).addClass("flagActive");
    var language = $(".flagActive").prop("id");
    localStorage.lang = language;
    translateInterface(language);
    storedLang = language;
  });

  $("#done").click(function() {
    var language = $(".flagActive").prop("id");
    localStorage.lang = language;
    translateInterface(language);
    storedLang = language;

    var option = $('input[name=popupOption]:checked').val();
    localStorage.popupOption = option;
    storedOption = option;

    var duration = $('#seconds').val();
    localStorage.duration = duration;
    storedDuration = duration;

    $("#settings").hide();
    $("#settings").siblings().show();
    $("body").height("203px");
  });

  $("#seconds").keyup(function() {
    $("#seconds").val(this.value.match(/[0-9]*/));
  });

  $("#backFromUser, #nn1").click(function() {
    var url = localStorage.url;
    if(url == getActiveTabUrl()) {
      var userVote = localStorage.userVote;
      if(userVote) {
        $(".vote").siblings().hide();
        $(".vote").show();
        var fullStarsNumber = Math.floor(userVote);
        var halfStarsNumber = (userVote - Math.floor(userVote) ) / 0.5;

        //here i need to set score based on vote
        if(fullStarsNumber === 0) fullStarsNumber = '';
        if(halfStarsNumber === 0) halfStarsNumber = '';
        else halfStarsNumber = 'half';
        $("#star" + fullStarsNumber + halfStarsNumber).prop('checked', true);
      } else {
        $(".vote").siblings().hide();
        $(".vote").show();
      }
    } else {
      $(".vote").siblings().hide();
      $(".vote").show();
    }
  });

  $("#backFromChange").click(function() {
    $("#changeError").html('&nbsp;');
    $(".vote").siblings().hide();
    $('.vote').show();
  });

  $("#backFromForgot").click(function() {
    $("#forgotError").html('&nbsp;');
    $(".loggedout").siblings().hide();
    $('.loggedout').show();
  });

  $("#changePass").click(function(e) {
    e.preventDefault();
    $(".changeDiv").siblings().hide();
    $('#newPass1').val("");
    $('#newPass2').val("");
    $('#oldPass').val("");
    $(".changeDiv").show();
  });

  $(".changePassButton").click(function(e) {
    var newPass1 = $('#newPass1').val();
    var newPass2 = $('#newPass2').val();
    var oldPass = $('#oldPass').val();

    if(oldPass == "") {
      $("#changeError").text(langs[storedLang].tEnterOld);
    }
    else if(newPass1 != newPass2 || newPass1 == "") {
      $("#changeError").text(langs[storedLang].tRetype);
    } else {
      $.post(dataBaseApi + '/changePassword', {
        userEmail: storedEmail,
        oldPass: oldPass,
        newPass: newPass1
      }).done(
        function(data) {
          if(data == "ok") {
            $("#changeError").html('&nbsp;');
            $(".successDiv").siblings().hide();
            $("#success").text(langs[storedLang].tPassSuccess);
            $(".successDiv").show();
            setTimeout(function() {
              $(".vote").siblings().hide();
              $('.vote').show();
              $("#success").text("");
            }, 2000);

          } else {
            $("#changeError").text(langs[storedLang].tOld);
          }
        }).fail(function(xhr, status, error) {
        $("#changeError").text(langs[storedLang].tSomething);
      });
    }
  });

  $(".forgotPass").click(function(e) {
    e.preventDefault();
    $(".forgot").siblings().hide();
    $("#forgottenPassMail").val("");
    $(".forgot").show();
  });

  $("#submitForgotenPassMail").click(function(e) {
    var email = $("#forgottenPassMail").val();
    $.post(dataBaseApi + '/forgotPassword', {
      email: email
    }).done(
      function(data) {
        if(data == "ok") {
          $("#forgotError").html('&nbsp;');
          $(".successDiv").siblings().hide();
          $("#success").text(langs[storedLang].tPassSent);
          $(".successDiv").show();
          setTimeout(function() {
            $(".loggedout").siblings().hide();
            $('.loggedout').show();
            $("#success").text("");
          }, 2000);

        } else {
          $("#forgotError").text(langs[storedLang].tMailNotFound);
        }
      }).fail(function(xhr, status, error) {
      $("#forgotError").text(langs[storedLang].tSomething);
    });
  });

  $(document).keypress(function(e) {
    //enter pressed
    if(e.which == 13) {
      if($(".loggedout").is(":visible")) {
        $(".loginButton").click();
      } else if($(".register").is(":visible")) {
        $(".registerButton").click();
      } else if($(".invite").is(":visible")) {
        $(".submitFriendsButton").click();
      } else if($(".changeDiv").is(":visible")) {
        $(".changePassButton").click();
      } else if($(".forgot").is(":visible")) {
        $("#submitForgotenPassMail").click();
      } else if($("#settings").is(":visible")) {
        $(".doneButton").click();
      }
    }
  });

  //Save email when popup is closed
  $("#loginEmail").keyup(function(e) {
    localStorage.tempMail = $("#loginEmail").val();
    localStorage.showLogin = showLogin;
    console.log($("#loginEmail").val());
  });
})();


function getActiveTabUrl () {
  // return safari.application.activeBrowserWindow.activeTab.url;
  return "http://google.com";
}

function openTabInSafari (url, title, sizeInfo) {
  // safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("openUrl", {url: url, title:title, sizeInfo:sizeInfo});
  safari.application.openBrowserWindow().activeTab.url = url;
}