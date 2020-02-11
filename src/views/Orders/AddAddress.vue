<template>
    <div class="addAddress">
        <Header :isLeft="true" :title="title"/>
        <!-- 添加地址 -->
        <div class="viewbody">
            <div class="content">
                <FormBlock label="联系人" placeholder="姓名" :tags="sexes" @checkSex="checkSex" 
                :selectSex="addressInfo.sex" v-model="addressInfo.name" />
                <FormBlock label="电话" type="number" placeholder="手机号码" v-model="addressInfo.phone" />
                <FormBlock @click="showSearch=true" label="地址" placeholder="小区/写字楼/学校等" icon="angle-right" v-model="addressInfo.address" />
                <FormBlock label="门牌号" placeholder="11号楼一单元1305" textarea="textarea" icon="edit" v-model="addressInfo.doorplate" />
                <div class="formblock">
                    <div class="label-wrap">标签</div>
                    <TabTag :tags="tags" @checkTag="checkTag" :selectTag="addressInfo.tag" />
                </div>
            </div>
            <!-- 确定按钮 -->
            <div class="form-button-wrap">
              <button @click="handleSave" class="form-button">确定</button>
            </div>
        </div>
        <!-- 搜索地址 -->
        <AddressSearch @close="closeSearchInp" :showSearch="showSearch" :addressInfo="addressInfo" />
    </div>
</template>

<script>
import Header from '../../components/Header'
import FormBlock from '../../components/Orders/FormBlock'
import TabTag from '../../components/Orders/TabTag'
import AddressSearch from '../../components/Orders/AddressSearch'
import { Toast } from "mint-ui";
export default {
    name: "AddAddress",
    data() {
        return {
            title:'',
            tags:["家", "学校", "公司"],
            sexes: ["先生", "女士"],
            addressInfo: {},//添加地址的表单信息
            showSearch: false,
            addressData: []
        }
    },
    components: {
        Header,
        FormBlock,
        TabTag,
        AddressSearch
    },
    created() {
      this.addressInfo = this.$route.params.addressInfo;
      this.title = this.$route.params.title;
    },
    methods: {
        //标签点击事件
        checkTag(item){
            // console.log(item);
            this.addressInfo.tag = item;
        },
        //性别点击事件
        checkSex(item){
            // console.log(item);
            this.addressInfo.sex = item;
        },
        //取消事件
        closeSearchInp() {
          this.showSearch=false;
        },
        //确定事件
        handleSave(){
          if (!this.addressInfo.name) {
          this.showMsg("请输入联系人");
          return;
          }

          if (!this.addressInfo.phone) {
            this.showMsg("请输入手机号");
            return;
          }

          if (!this.addressInfo.address) {
            this.showMsg("请输入收货地址");
            return;
          }
          this.addAddress();
        },
        //弹窗提示
        showMsg(msg) {
          Toast({
            message: msg,
            position: "bottom",
            duration: 2000
          });
        },
        //添加地址
        addAddress() {
          this.addressData.push(this.addressInfo);
          console.log(this.addressData);
          this.$eventBus.$emit('addition',{
            addressData:this.addressData
          });
          this.$router.push("/myAddress");
        }
    }
}
</script>


<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.content {
  padding-left: 4vw;
  background: #fff;
  font-size: 0.94rem;
}

.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

/* 确定按钮 */
.form-button-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-button-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw 0;
  border: none;
  font-weight: 500;
}
</style>

