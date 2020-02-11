<template>
    <div class="search">
        <Header :isLeft="true" title="搜索" />
        <!-- 搜索区域 -->
        <div class="search_header">
            <form class="search_wrap">
                <i class="fa fa-search"></i>
                <input type="text" v-model="key_word" placeholder="输入商家,商品信息">
                <button @click.prevent="searchHandle">搜索</button>
            </form>
        </div>
        <!-- 搜索列表区域 -->
        <div class="shop" v-if="searchRes && !showShop">
            <!-- 搜索为空时显示的内容 -->
            <div class="empty_wrap"  v-if="empty">
                <img src="https://fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png">
                <div class="empty_txt">
                    <h4>附近没有搜索结果</h4>
                    <span>换个关键词试试吧</span>
                </div>
            </div>
            <div v-else>
                <!-- 搜索列表组件 -->
                <SearchIndex :data="searchRes.restaurants" @listClick="$router.push('/shop')" />
                <SearchIndex :data="searchRes.words" @listClick="shopItemClick" />
            </div>
        </div>
        <!-- 商家信息区域 -->
        <div class="container" v-if="showShop">
            <!-- 导航组件 -->
            <FilterView :filterData="filterData"  @updata="updata" />
            <!-- 为 HTML 元素添加 v-infinite-scroll 指令即可使用无限滚动 -->
            <!-- infinite-scroll-disabled	若为真，则无限滚动不会被触发 -->
            <div v-infinite-scroll="loadMore"  :infinite-scroll-disabled="loading">
                <!-- 商家详情列表组件 -->
                <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header'
import SearchIndex from '../components/SearchIndex'
import FilterView from '../components/FilterView';
import IndexShop from '../components/IndexShop';
import { InfiniteScroll } from 'mint-ui';
export default {
    name:'Search',
    components: {
        Header,
        SearchIndex,
        FilterView,
        IndexShop
    },
    data() {
        return {
            key_word: '',
            searchRes: null,//搜索结果
            empty: false,//搜索结果是否为空
            showShop: false,//控制搜索结果 商家信息 显示的开关
            filterData: null,
            restaurants: [],//存放所有商家容器
            page: 0,
            size: 7,
            loading: false,//是否触发无限滚动
            data: null//筛选条件
        }
    },
    watch: {
        key_word(){
            this.empty= false;//数据初始化
            this.showShop= false;//数据初始化
            this.keyWordChange();
        }
    },
    created() {
        this.getFilterData();
    },
    methods: {
        //获取搜索结果数据
        async keyWordChange(){
            // console.log(this.key_word);
            const res = await this.$axios.get(`/api/profile/typeahead/${this.key_word}`);
            console.log(res);
            if(res.status!==200){
                this.searchRes= null;
            }else{
                this.searchRes= res.data;
            }
        },
        //搜索事件
        searchHandle(){
            if(!this.key_word) return;
            //搜索
            if(this.searchRes && (this.searchRes.restaurants.length > 0 || this.searchRes.words.length)){
                // console.log("有内容");
                this.shopItemClick()
            }else {
                this.empty= true;
                // console.log("搜索结果为空");
            }
        },
        //点击搜索列表事件(显示商家信息)
        shopItemClick(){
            //点击搜索需要把一些信息初始化
            this.page= 0;
            this.restaurants= [];
            this.showShop= true;
        },
        //商家 用到的数据
        async getFilterData() {
            const  {data:result} = await this.$axios.get('/api/profile/filter');
            this.filterData=result;
        },
        //跟新排序条件 筛选
        updata(condition){
          // console.log(condition);
          this.data= condition;
        },
        //获取商家信息
        async getRestaurants(){
          const {data:res} = await this.$axios.post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data);
        //   this.restaurants=res;
        if(res.length > 0){
            res.forEach(item => {
                this.restaurants.push(item)
            })
        }else {
            //停止无限滚动
            this.loading = true;
        }
        },
        //无限滚动事件
        loadMore(){
            this.page++;
            this.getRestaurants();
        }
    }
}
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.search_header {
  margin-top: 45px;
  background: #fff;
  padding: 0 4.266667vw;
}
.search_header .search_wrap {
  padding: 2.933333vw 2.933333vw 2.933333vw 0;
  display: flex;
  align-items: center;
  position: relative;
}
.search_wrap .fa-search {
  width: 2.933333vw;
  height: 2.933333vw;
  color: #888;
  position: absolute;
  top: 4.6666666vw;
  left: 2.933333vw;
}
.search_wrap input {
  flex-grow: 1;
  border-radius: 0.266667vw;
  background-color: #f8f8f8;
  padding: 1.733333vw 4vw 1.733333vw 8.8vw;
  color: #666;
  outline: none;
  border: none;
}
.search_wrap button {
  outline: none;
  border: none;
  color: #333;
  font-size: 0.426667rem;
  background: #fff;
  font-weight: 700;
  margin-left: 2.933333vw;
  font-size: 14px;
}

.shop {
  width: 100%;
  height: calc(100% - 95px);
  overflow: auto;
}

.empty_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
}
.empty_wrap img {
  width: 35vw;
  height: 35vw;
}
.empty_txt h4 {
  color: #666;
  font-size: 1rem;
  margin: 12vw 0 2vw 0;
}
.empty_txt span {
  color: #999;
  font-size: 0.8rem;
}
</style>
