$(function(){
    if($('.price span.fee').html() == 0){
      $('.wxPay').attr('disabled','disabled');
    }else{
      $('.wxPay').removeAttr('disabled');
    }
    var userInfo = Options.GetUserInfo(); 
    var buy = JSON.parse(localStorage.getItem('buy'));
    TD_Request("ds", "ord", {
      action:localStorage.getItem('buy')
    }, function(code,data){
      // 请求成功
      if(code == 0){
        console.log(data)
        $('.dream_title').html(data.pool.ptitle);
        $('.help_money').html("￥"+data.pool.cbill/100);
        $('.target_money').html("￥"+data.pool.tbill/100)
        drawCircle(ctx,(data.pool.cbill/100)/(data.pool.tbill/100));
        // 能够卖的份数
        var num = $('.copies_money span').html();
        $('.icon_add').click(function(){
          num++;
          if(num > buy.buy.dayLim) {
            num = buy.buy.dayLim;
            $('.copies_money span').html(num);
          }
          $('.copies_money span').html(num);
          $('.price span.fee').html(data.pool.ubill/100 * $('.copies_money span').html());
        })
        $('.icon_incer').click(function(){
          num--;
          if(num <= 0){
            num = 0;
            $('.copies_money span').html(num);
          }
          $('.copies_money span').html(num);
          $('.price span.fee').html(data.pool.ubill/100 * $('.copies_money span').html());
        })
        $('.price i').html(data.pool.ubill/100+"元/份");
      }
      // 统一下单
      $('.wxPay').click(function(){
        var fee = $('.price span.fee').html();
        console.log(fee);
        TD_Request("ds","wxpayweb",{
          oid:data.order.oid,
          bill:fee * 100,
          uid:userInfo.openid
        },function(code,data){
          if(code == 0){
            console.log(data)
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
              "appId":data.appId,     //公众号名称，由商户传入     
              "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
              "nonceStr":data.nonceStr, //随机串     
              "package":data.package,     
              "signType":data.signType,         //微信签名方式：     
              "paySign":data.paySign //微信签名 
              },function(res){
                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                  console.log(res);
                } 
             }); 
          }
        },function(code,data){
          console.log(data)
        })
      })
    }, function(code,data){
      // 请求失败
      if(code != 0){
        console.log(data)
      }
    })
    ready();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    function ready(){
        var canvas = document.getElementById('bottom');
        var cxt_arc = canvas.getContext("2d");
        cxt_arc.lineWidth = 15;
        cxt_arc.strokeStyle = '#edf0f5';
        cxt_arc.lineCap = 'round';
        cxt_arc.beginPath();
        cxt_arc.arc(95, 95, 80, 0, 2 * Math.PI, false);
        cxt_arc.stroke();
    }
    function drawCircle(ctx,prop){
        if(prop == 0){
            ctx.clearRect(0,0,190,190);
        }else{
            prop = prop * 2;
        }
        ctx.clearRect(0,0,190,190);
        ctx.fillStyle = 'white';
        ctx.clearRect(0,0,190,190);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#ffc057';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(95, 95, 80, Math.PI/-2, prop * Math.PI - Math.PI / 2, false);
        ctx.stroke()
    }
});
