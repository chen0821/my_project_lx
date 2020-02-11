<template>
    <div class="pay">
        <Header title="在线支付"/>
        <div class="main">
            <div class="tip">
                <p class="countdown-title">支付剩余时间</p>
                <h3 class="countdown-text">{{countDown}}</h3>
            </div>
            <section class="home">
                <ul class="list info-list">
                    <li>
                        <span class="order-name">{{orderInfo.shopInfo.name}}</span>
                        <span class="text-highlight">￥{{totalPrice}}</span>
                    </li>
                </ul>
                <div class="title">在线支付</div>
                <ul class="list payment-list">
                    <li class="payment-list-item">
                        <div class="icon">
                            <img src="../../assets/wechart.jpg">
                            <span>微信</span>
                        </div>
                        <i class="fa fa-check-circle selected"></i>
                    </li>
                </ul>
            </section>
            <button @click="pay" class="btn-submit" :disabled="timeOut">确认支付</button>
        </div>
    </div>
</template>

<script>
import Header from '../../components/Header'
export default {
    name: 'Pay',
    components: {
        Header
    },
    data() {
        return {
            countDown: '00:15:00',
            timer: null,//定时器
            timeOut: false//控制确认支付按钮
        }
    },
    created() {
        this.countTimeDown();
    },
    computed: {
        orderInfo(){
            return this.$store.getters.orderInfo
        },
        totalPrice(){
            return this.$store.getters.totalPrice
        }
    },
    methods: {
        //倒计时
        countTimeDown(){
            let m = 14;
            let s = 59;
            this.timer = setInterval(() => {
                s--;
                if(m == '00' && s == '00'){
                    this.countDown = '订单已超时';
                    clearInterval(this.timer);
                    this.timeOut = true;
                    return;
                }
                if(s == '00'){
                    s = 59;
                    m--;
                    if(m < 10){
                        m = '0' + m;
                    }
                }
                if(s < 10){
                    s = '0' + s;
                }
                this.countDown='00:'+ m + ':' + s;
            },1000)
        },
        pay(){
            const data = {
               body: "米修在线",//商品描述
               out_trade_no: new Date().getTime().toString(),//订单号
               total_fee: 1//标价币种(以分为单位)
             };
             alert("进入到pay方法中");
             // 请求 http://www.thenewstep.cn/wxzf/example/jsapi.php
             fetch("http://www.thenewstep.cn/wxzf/example/jsapi.php", {
               method: "POST",
               headers: {
                 "Content-type": "application/json"
               },
               body: JSON.stringify(data)
             })
             //json() 方法返回解析正文文本为JSON的结果。这可以是任何可以由JSON表示的东西：对象、数组、字符串、数字等等。
               .then(res => res.json())
               .then(data => {
                 this.onBridgeReady(data);
               })
               .catch(err => {
                 alert("请求失败");
            });
        },
        //微信支付API
        onBridgeReady(data) {
        WeixinJSBridge.invoke("getBrandWCPayRequest", data, res => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          alert("支付成功");
          // 生成订单
        //   this.addOrder();
        }
      });
     },
    }
}
</script>

<style scoped>
.pay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.tip {
  display: block;
  text-align: center;
  background-color: #fff;
  color: #333;
  padding: 2rem;
  line-height: 2rem;
}
countdown-title {
  font-size: 0.88rem;
  color: #999;
}
.countdown-text {
  height: 2rem;
  color: #333;
  font-size: 1.8rem;
}
down-text {
  height: 2rem;
  color: #333;
  font-size: 1.8rem;
}
.list {
  border-bottom: 0.5px solid #eee;
  background: #fff;
}
.info-list {
  padding: 0 1.5rem;
}
.info-list li {
  border-top: 0.5px solid #eee;
  display: flex;
  padding: 1.5rem 0;
  font-size: 1rem;
  line-height: 1rem;
  justify-content: space-between;
}
.info-list li .order-name {
  color: #333;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16px;
  max-width: 60%;
}
.text-highlight {
  color: #ff6000;
}
.title {
  background-color: #f5f5f5;
  font-size: 0.88rem;
  padding: 1.2rem 1.2rem 1rem;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.payment-list-item {
  border-bottom: 0.5px solid #eee;
  padding: 0.9rem 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  display: flex;
  align-items: center;
}
.payment-list-item img {
  width: 2.4rem;
  height: 2.4rem;
  margin-right: 20px;
}
.payment-list-item > i {
  font-size: 1.5rem;
  color: #eee;
}
.selected {
  color: #4cd964 !important;
}
.btn-submit-wrap {
  margin: 1rem auto;
  width: 90%;
}
.btn-submit {
  font-size: 1.1rem;
  line-height: 1.5rem;
  background-color: #4cd964;
  width: 100%;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  padding: 0.5rem;
  box-sizing: border-box;
  margin-top: 15px;
}

/* 不可点击btn */
.btn-submit[disabled] {
  background-color: #bbb !important;
}
</style>

