<template>
    <div class="address">
        <!-- 头部组件 -->
        <Header :isLeft="true" title="选择收货地址" />
        <!-- 搜索区 -->
        <div class="city_search">
            <div class="search">
                <span class="city" @click="$router.push('/city')">
                    {{city}}
                    <i class="fa fa-angle-down"></i>
                </span>
                <i class="fa fa-search"></i>
                <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等">
            </div>
            <!-- 位置组件 -->
            <Location :address="address" @clickAddress="selectAddress" />
        </div>
        <div class="area" v-show="isShow">
          <ul class="area_list" v-for="item in placeList" :key="item.id">
            <li @click="selectAddress(item)">
              <h4>{{item.name}}</h4>
              <p>{{item.district}}{{item.address}}</p>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header'
import Location from '../components/Location'

export default {
  // name:'address',
  components: {
      Header,
      Location
  },
  data() {
      return {
          city:'',
          search_val:'',
          placeList:[]
      }
  },
  created() {
    this.city=this.$route.params.city
  },
  // //   到达这个组件时
  // beforeRouteEnter(to,from,next) {
  //   //   console.log(to);
  //     next(vm => {
  //     //因为当钩子执行前，组件实例还没被创建
  //     // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
  //     //   console.log(vm);//当前组件的实例
  //         vm.city=to.params.city
  //     })
  // },
  computed: {
    address() {
      return this.$store.getters.location.formattedAddress;
    },
    isShow(){
      if(this.search_val.trim()===''){
        return false
      }else {
        return true
      }
    }
  },
  watch: {
      search_val(){
        this.searchPlace()
      }
  },
  methods: {
      //搜索地址
      searchPlace(){
        const that=this
        // 输入提示与POI搜索
        AMap.plugin('AMap.Autocomplete', function(){
          // 实例化Autocomplete
          var autoOptions = {
            //city 限定城市，默认全国
            city: that.city
          }
          var autoComplete= new AMap.Autocomplete(autoOptions);
          autoComplete.search(that.search_val, function(status, result) {
            // 搜索成功时，result即是对应的匹配数据
            // console.log(result);
            that.placeList=result.tips
          })
        })
      },
      //选中搜索出的地址信息，更新地址
      selectAddress(item){
       // 设置地址
      if (item) {//如果有传值
        this.$store.dispatch(
          "setAddress",
          item.district + item.address + item.name
        );
      } else {
        this.$store.dispatch("setAddress", this.address);
      }
      // 跳转home
        this.$router.push('/home')
      }
  }
}
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}
.search .city {
  padding: 0 10px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>
