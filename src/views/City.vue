<template>
    <div class="city">
        <div class="search_wrap">
            <div class="search">
                <i class="fa fa-search"></i>
                <input type="text" v-model="city_val" placeholder="输入城市名">
            </div>
            <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
        </div>
        <div style="height:100%" v-if="searchList.length===0">
            <div class="location">
                <!-- 当前位置组件 -->
                <!-- 别的selectCity(item) 获取时都是item.name-->
                <!-- 所以此处需要传递的是对象要有name属性 -->
                <Location @clickAddress="selectCity({name:city})" :address="city" />
            </div>
            <!-- 所有城市名组件 -->
            <Alphabet @selectCity="selectCity" :cityInfo="cityInfo" :keys="keys" ref="allcity" />
        </div>
        <div class="search_list" v-else>
            <ul>
                <li @click="selectCity(item)" v-for="(item,index) in searchList" :key="index">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Location from "../components/Location";
import Alphabet from "../components/Alphabet";

export default {
  name:'city',
  data() {
      return {
          city_val:'',
          cityInfo: null,//所有城市信息
          keys:[],//  A---Z
          allCities:[],//所有城市名
          searchList:[]//搜索列表
      }
  },
  components:{
      Location,
      Alphabet
  },
  computed: {
      //当前城市
      city() {
       return this.$store.getters.location.addressComponent.city ||  this.$store.getters.location.addressComponent.province
    }
  },
  created() {
      this.getCityInfo()
  },
  watch: {
      //监听input输入的值
      city_val(){
        //   console.log(this.city_val);
          this.searchCity();
      }
  },
  methods: {
      //获取城市信息
      async getCityInfo(){
          const {data:res} =await this.$axios.get('/api/posts/cities');
          console.log(res);
          this.cityInfo=res;
          // 获取cityInfo中的key值
          this.keys=Object.keys(res);
          // hotcities这个key移除掉
          this.keys.pop();
          // keys 排序
          this.keys.sort();
        //   console.log(this.keys);
        this.$nextTick(() => {
            this.$refs.allcity.scrollPage();
        });
        // 存储所有城市, 用来搜索过滤,获取所有城市名item.name
        this.keys.forEach(k => {
            // console.log(k);
            this.cityInfo[k].forEach(item => {
                this.allCities.push(item) 
            })
        })
        // console.log(this.allCities);
      },
      //更改城市
      selectCity(city){
          console.log(city.name);
          this.$router.push({ name: "address", params: { city: city.name } });
      },
      searchCity(){
          if(!this.city_val){
              // 如果搜索框为空, 数组置空
              this.searchList=[]
          }else {
              // 过滤allCities
              // 根据输入框的关键字检索城市 并存入到searchList数组中
              this.searchList= this.allCities.filter(item => {
                  //=-1 表示不存在
                  return item.name.indexOf(this.city_val) !=-1//过滤出包含关键字的城市
              })
            //   console.log(this.searchList);
          }
      }
  }
}
</script>

<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  border: none;
  outline: none;
  background: #fff;
  color: #009eef;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
