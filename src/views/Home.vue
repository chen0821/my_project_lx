<template>
    <div class="home">
      <!-- 头部地址区域 -->
      <div class="header">
        <!-- vue this.$router.push()传参 -->
        <!-- patams传参 ，路径不能使用path 只能使用name,不然获取不到传的数据 -->
        <!-- this.$router.push({name: 'dispatch', params: {paicheNo: obj.paicheNo}}) -->
        <!-- 取数据：this.$route.params.paicheNo -->
        <div class="address_map" @click="$router.push({name: 'address',params: {city: city}})">
          <i class="fa fa-map-marker"></i>
          <span>{{address}}</span>
          <i class="fa fa-sort-desc"></i>
        </div>
      </div>
      <!-- 搜索区域 -->
      <!-- fixedview 搜索框向上移动到顶部的类 -->
      <div @click="$router.push('/search')" class="search_wrap" :class="{'fixedview':showFilter}">
        <div class="shop_search">
          <i class="fa fa-search"></i>
          搜索商家 商家名称
        </div>
      </div>
      <div class="container">
        <!-- 轮播图 -->
        <mt-swipe :auto="4000" class="swiper">
          <mt-swipe-item v-for="(item,index) in swipeImgs" :key="index">
            <img :src="item">
          </mt-swipe-item>
        </mt-swipe>
        <!-- 分类 -->
        <!-- 第一次循环是  循环有几页 -->
        <!-- 第二次循环是把每页里的数据展示出来 -->
        <mt-swipe :auto="0" class="entries">
          <mt-swipe-item v-for="(item,index) in entries" :key="index" class="entry_wrap">
            <div class="foodentry" v-for="(data,i) in item" :key="i">
              <div class="img_wrap">
                <img :src="data.image">
              </div>
              <span>{{data.name}}</span>
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <!-- 推荐商家 -->
      <div class="shoplist-title">推荐商家</div>
      <!-- 导航组件 -->
      <FilterView :filterData="filterData" @searchFixed="showFilterView" @updata="updata" />
      <!-- 下拉/上拉刷新 -->
      <!-- topMethod	下拉刷新执行的方法 -->
      <!-- bottomMethod	上拉刷新执行的方法 -->
      <!-- bottomAllLoaded	若为真，则 bottomMethod 不会被再次触发 -->
      <!-- autoFill	若为真，loadmore 会自动检测并撑满其容器 -->
      <!-- '上拉刷新'时提示区域的文字 -->
      <mt-loadmore 
      :top-method="loadData" 
      :bottom-method="loadMore" 
      :bottom-all-loaded="allLoaded" 
      ref="loadmore" 
      :autoFill="false" 
      :bottomPullText="bottomPullText"
      >
        <!-- 商家详情组件 -->
        <IndexShop v-for="(item,index) in restaurants"  :key="index" :restaurant="item.restaurant" />
      </mt-loadmore>
      
    </div>
</template>

<script>
import { Swipe, SwipeItem, Loadmore} from 'mint-ui';
import FilterView from '../components/FilterView';
import IndexShop from '../components/IndexShop';

export default {
  name:'home',
  data() {
    return {
      swipeImgs: [],//轮播图片
      entries: [],//分类数据
      filterData: null,//推荐商家 用到的数据
      showFilter: false,//搜索框是否向上移动
      page: 1,
      size: 5,
      restaurants: [],//存放所有商家容器
      allLoaded: false,//是否加载完毕
      bottomPullText:'上拉加载更多',
      data: null//筛选条件
    }
  },
  components: {
    FilterView,
    IndexShop
  },
  computed: {
    address() {
      return this.$store.getters.address
    },
    city() {
      return this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province
    }
  },
  created() {
    this.getData();
    this.getRestaurants();
  },
  methods: {
    async getData(){
      const  {data:res} = await this.$axios.get('/api/profile/shopping');
      // console.log(res);
      this.swipeImgs=res.swipeImgs;
      this.entries=res.entries;
      const  {data:result} = await this.$axios.get('/api/profile/filter');
      // console.log(result);
      this.filterData=result;
    },
    //搜索框是否向上移动的方法
    showFilterView(isTop){
      this.showFilter=isTop
    },
    //跟新排序条件 筛选
    updata(condition){
      // console.log(condition);
      this.data= condition;
      this.loadData();
    },
    //获取商家信息
    async getRestaurants(){
      const {data:res} = await this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data);
      console.log(res);
      this.restaurants=res;
      // 在加载数据后需要对组件进行一些重新定位的操作
      this.$refs.loadmore.onTopLoaded();
    },
    //下拉刷新
    loadData(){
      //下拉刷新时把下面的属性重置
      this.page= 1;
      this.allLoaded= false;
      this.bottomPullText= '上拉加载更多';
      this.getRestaurants();
    },
    //上拉加载更多
    async loadMore(){
      if(!this.allLoaded){//this.allLoaded为真可以获取更多数据
        this.page++;
        // 拉取商家信息
        const {data:res} = await this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`);
        //在加载数据后需要对组件进行一些重新定位的操作
        this.$refs.loadmore.onBottomLoaded();//加载完之后重新渲染
        if(res.length > 0){
          res.forEach(item => {
            this.restaurants.push(item)
          })
          if(res < this.size){
            this.allLoaded = true;
            this.bottomPullText= '数据加载完毕';
          }
        }else {
            // 数据为空
            this.allLoaded = true;
            this.bottomPullText = "数据加载完毕";
        }
      }
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold;
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block;
  width: 80%;
  /* 一行显示超出省略 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}

.search_wrap {
  /* sticky当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如fixed */
  position: sticky;
  top: 0px;
  z-index: 999;
  box-sizing: border-box;
}
.swiper {
  height: 100px;
}
.swiper img {
  width: 100%;
  height: 100px;
}

.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}
/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

.fixedview {
  width: 100%;
  position: fixed;
  top: 0px;
  z-index: 999;
}

.mint-loadmore {
  /* 把搜索框区域和排序的高度减去 55 40*/
  height: calc(100% - 95px);
  overflow: auto;
}
</style>
