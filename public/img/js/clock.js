$(function(){
  function leftPad(number, targetLength) {
      var output = number + '';
      while (output.length < targetLength) {
          output = '0' + output;
      }
      return output;
  }
  function animateFlip(hand, count) {
    $(hand).find('.flip--top').eq(0).addClass('flipTopAnimation');
    var bottomClock = parseInt(count)-1;
    if (bottomClock<0) {
      bottomClock = 0;
    }

    $(hand).find(".flip--top, .flip--bottom").text(leftPad(bottomClock,2));
    $(hand).find(".flip--next, .flip--back").text(leftPad(count,2));

    function removeFlip(hand, count) {
      function removeFlip2(hand, count) {
        $(hand).find('.flip--top').eq(0).removeClass('flipTopAnimation');
        $(hand).find('.flip--back').eq(0).removeClass('flipBackAnimation');
        $(hand).find(".flip--next, .flip--back,  .flip--bottom").text(leftPad(count,2));
      }
      $(hand).find('.flip--back').eq(0).addClass('flipBackAnimation');
      $(hand).find(".flip--top").text(leftPad(count,2));
      setTimeout(function(){
           removeFlip2(hand, count);
      }, 350);
    }
    setTimeout(function(){
         removeFlip(hand, count);
    }, 350);
  }

  function setHand(hand, count, isHour) {
      var oldVal = parseInt($(hand).find(".flip--top").eq(0).text());
      count = parseInt(count);
      if (isHour) {
        var isPm = false;
        if (count==0) {
          count = 12;
        }
        else if (count>=12) {
          count-= 12;
          if (count == 0) {
            count = 12;
          }
          isPm = true;
        }
      }
      // Flip
      if (parseInt(oldVal) != count) {
        if (isHour) {
          if (isPm) {
            $('.seg').find('.ampm').eq(0).text('pm');
          }
          else {
            $('.seg').find('.ampm').eq(0).text('am');
          }
        }
        animateFlip(hand, count);
      }
  }

  var currentDate = new Date();
  var intervalTime = 1000;

  function setTime() {
    var currentDate = new Date();
    var hour = currentDate.getHours();

    var hour1stHand = $('#clock_hourHand').find('.flip-wrapper').eq(0);
    setHand(hour1stHand, hour, true);

    var min1stHand = $('#clock_minuteHand').find('.flip-wrapper').eq(0);
    var min = currentDate.getMinutes();

    setHand(min1stHand, min, false);
  }

  $('#clock_hourHand').find('.flip-wrapper').eq(0).find(".flip--top, .flip--bottom").text(leftPad(-1));
  $('#clock_hourHand').find('.flip-wrapper').eq(0).find(".flip--next, .flip--back").text(leftPad(-1));

  $('#clock_minuteHand').find('.flip-wrapper').eq(0).find(".flip--top, .flip--bottom").text(leftPad(-1));
  $('#clock_minuteHand').find('.flip-wrapper').eq(0).find(".flip--next, .flip--back").text(leftPad(-1));

  setTime();

  setInterval(function(){
       setTime();
  }, intervalTime);

})
