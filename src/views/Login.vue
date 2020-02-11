<template>
    <div class="login">
        <div class="logo">
            <img src="../assets/logo.jpg" alt="my login image">
        </div>
        <!-- 手机号 -->
        <InputGroup 
        type="number"
        v-model="phone"
        placeholder="手机号"
        :btnTitle="btnTitle"
        :disabled="disabled"
        :error="errors.phone"
        @btnClick="getVerifyCode"
        />
        <!-- 验证码 -->
        <InputGroup 
        type="number"
        v-model="verifyCode"
        placeholder="验证码"
        :error="errors.code"
        />
        <!-- 用户协议 -->
        <div class="login_des">
            <p>
                新用户登录即自动注册，表示已同意
                <span>《用户服务协议》</span>
            </p>
        </div>
        <!-- 登录按钮 -->
        <div class="login_btn">
            <button :disabled="isClick" @click="handleLogin">登录</button>
        </div>
    </div>
</template>

<script>
import InputGroup from '../components/InputGroup'
export default {
    name: "login",
    components: {
        InputGroup
    },
    data() {
        return {
            phone:"15617831821",//手机号码
            verifyCode:"",//验证码
            errors:{},
            btnTitle:"获取验证码",
            disabled:false
        }
    },
    computed: {
        isClick(){
            if(!this.phone || !this.verifyCode){
                return true
            }else{
                return false
            }
        }
    },
    methods: {
        //获取验证码
        getVerifyCode(){
            if(this.validatePhone()){//手机号格式正确
                //发送网络请求
                this.$axios.post('/api/posts/sms_send',{
                    sid: "14e417f09f2e6d130347a40e4920e656",
                    token: "099b1d2dc2316735e7ae7d952e2c9b16",
                    appid:"191396b6a7ee42fdb86a672a11b923ca",
                    templateid:"527958",
                    phone: this.phone
                }).then(res => {
                    console.log(res);
                    this.validateBtn();
                })
            }
        },
        //验证手机号
        validatePhone(){
            var validate=/^1[345678]\d{9}$/;
            if(!this.phone) {//为空
                this.errors = {
                    phone:"手机号码不能为空"
                }
                return false
            }else if(!validate.test(this.phone)) {//手机号验证
                this.errors = {
                    phone:"请输入正确格式的手机号"
                }
                return false
            }else {//格式正确
                this.errors = {}
                return true
            }
        },
        //倒计时效果
        validateBtn(){
            let time = 60;
            let timer = setInterval(()=>{
              if(time == 0){
                  clearInterval(timer);
                  this.btnTitle ="获取验证码";
                  this.disabled=false
              }else {
                  this.btnTitle =time+"秒后重试";
                  this.disabled=true;
                  time--
              }
            },1000)
        },
        handleLogin() {
          // 取消错误提醒
          this.errors = {};
          // 发送请求
          this.$axios
            .post("/api/posts/sms_back", {
              phone: this.phone,
              code: this.verifyCode
            })
            .then(res => {
              console.log(res.data);
              // 检验成功 设置登录状态并且跳转到/
              localStorage.setItem("ele_login", res.data.user._id);
              this.$router.push("/");
            })
            .catch(err => {
              // 返回错误信息
              this.errors = {
                code: err.response.data.msg
              };
            });
        this.$router.push("/");
        }
    }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}
.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>
