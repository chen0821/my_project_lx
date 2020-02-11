<template>
    <div class="area" v-if="cityInfo" ref="area_scroll">
        <div class="scroll_wrap">
            <!-- 热门城市 -->
            <div class="hot_wrap citylist">
                <div class="title">热门城市</div>
                <ul class="hot_city">
                    <li @click="$emit('selectCity',item)" v-for="(item,index) in cityInfo.hotCities" :key="index">{{item.name}}</li>
                </ul>
            </div>
            <!-- 所有城市列表 -->
            <div class="city_wrap">
                <!-- 循环按字母排序的key -->
                <div class="city_content citylist" v-for="(item,index) in keys" :key="index">
                    <!--  列表中的A至Z  -->
                    <div class="title">{{item}}</div>
                    <!-- 根据字母key展示城市名 -->
                    <ul>
                        <li @click="$emit('selectCity',city)" v-for="(city,index) in cityInfo[item]" :key="index">{{city.name}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 右侧A至Z -->
        <div class="area_keys">
            <ul>
                <!-- 为 #-Z 设置下标 0-22 -->
                <li @click="selectKey(0)">#</li>
                <li @click="selectKey(index+1)" v-for="(item,index) in keys" :key="index">{{item}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name:'Alphabet',
  props: {
      cityInfo: Object,
      keys: Array
  },
  data() {
      return {
          scroll: null
      }
  },
  methods:{
      //实现滚动
      scrollPage(){
          this.scroll=new BScroll(this.$refs.area_scroll,{
              click: true,
              mouseWheel: true
          })
      },
    //   通过下标实现字母索引选择城市
      selectKey(index){
        //   console.log(index);//字母索引下标0-22
        //   console.log(this.$refs.area_scroll.getElementsByClassName('citylist'));//通过类名citylist获取城市列表 也是23个 0-22
          const citylist=this.$refs.area_scroll.getElementsByClassName('citylist');
          const el=citylist[index];
          //scrollToElement(el, time, offsetX, offsetY, easing)滚动到指定的目标元素。
          // el 滚动到的目标元素 time 滚动动画执行的时长
          this.scroll.scrollToElement(el,300)
      }
  }
}
</script>

<style scoped>
.area {
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 16px;
  background: #fff;
  height: calc(100% - 65px);
  overflow: hidden;
}
.scroll_wrap {
  background: #fff;
  overflow: auto;
}
.title {
  color: #aaa;
  padding: 15px 0;
}
.hot_city {
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.hot_city li {
  width: 30%;
  background: #f1f1f1;
  margin: 0 10px 10px 0;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.city_content li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.area_keys {
  position: fixed;
  right: 0;
  top: 25%;
  color: #aaa;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  padding: 0 5px;
}
</style>
