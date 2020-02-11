<template>
                    <!-- open蒙版 -->
    <div :class="{'open':isSort || isScreen}" @click.self="cancelOpen">
        <!-- 导航 -->
        <div class="filter_wrap" v-if="filterData">
            <aside class="filter">
                <!-- 通过动态绑定类名，更改选中项的样式 -->
                <div class="filter-nav" v-for="(item,index) in filterData.navTab" :key="index" :class="{'filter-bold':currentFilter===index}" @click="filterSort(index)">
                    <span>{{item.name}}</span>
                    <i :class="'fa fa-'+item.icon"></i>
                </div>
            </aside>
        </div>
        <!-- 综合排序 -->
        <section class="filter-extend" v-if="isSort">
            <ul>
                <li v-for="(item,index) in filterData.sortBy" :key="index" @click="currentSortFn(item,index)">
                    <span :class="{'selectName':currentSort==index}">{{item.name}}</span>
                    <i v-show="currentSort==index" class="fa fa-check"></i>
                </li>
            </ul>
        </section>
        <!-- 筛选 -->
        <section class="filter-extend" v-if="isScreen">
            <div class="filter-sort">
              <div class="morefilter" v-for="(screen,index) in filterData.screenBy" :key="index">
                  <!-- 标题 -->
                  <p class="title">{{screen.title}}</p>
                  <ul>
                    <!-- 选项 -->
                    <li :class="{'selected':item.select}" @click="selectScreen(item,screen)" v-for="(item,i) in screen.data" :key="i">
                      <img v-if="item.icon" :src="item.icon">
                      <span>{{item.name}}</span>
                    </li>
                  </ul>
              </div>
            </div>
            <div class="morefilter-btn">
              <span @click="clearFilter" :class="{'edit':edit}" class="morefilter-clear">清空</span>
              <span @click="filterOk" class="morefilter-ok">确定</span>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "filterView",
    data() {
        return {
            currentFilter:0,//当前选中的导航索引
            isSort: false,//是否开启蒙版 综合排序列表
            currentSort:0,//当前选中的排序
            isScreen: false,//是否开启蒙版 筛选列表
        }
    },
    props: {
        filterData: Object//推荐商家里 用到的数据
    },
    computed: {
      edit(){//控制清空高亮显示
        let edit= false;
        this.filterData.screenBy.forEach(screen => {
          screen.data.forEach(item => {
            if(item.select){//如果有被选中的
              edit= true
            }
          })
        })
        return edit
      }
    },
    methods: {
        //导航点击事件
        filterSort(index){
            this.currentFilter=index;//更改当前项索引
            if(index==0){//点击综合排序时开启蒙版
                this.isSort=true;
                this.$emit('searchFixed',true);
            }else if(index==1){
                // 更新排序条件
             this.$emit('updata',{condition:this.filterData.navTab[1].condition});
             this.cancelOpen();
            }else if(index==2){
                // 更新排序条件
             this.$emit('updata',{condition:this.filterData.navTab[2].condition});
             this.cancelOpen();
            }else if(index==3){
              this.isScreen=true;
              this.isSort=false;
              this.$emit('searchFixed',true);
            }else{
                this.cancelOpen()
            }
        },
        //取消蒙版事件 关闭综合排序 筛选
        cancelOpen(){
            this.isSort=false;
            this.isScreen=false;
            this.$emit('searchFixed',false);
        },
        //排序事件
        currentSortFn(item,index){
            this.currentSort=index;
            this.filterData.navTab[0].name=this.filterData.sortBy[index].name;
            this.cancelOpen();
            // console.log(item.code);
             // 更新数据
             this.$emit('updata',{condition:item.code})
        },
        //筛选
        selectScreen(item,screen){
          if(screen.id!=='MPI'){//MPI是商家服务
              //单选
            screen.data.forEach(x => {
              //如果是单选的话先把全部选项设置为false
              x.select= false;
            })
          }
          //取反
          //单选只有选中项高亮
          item.select= !item.select;
        },
        //清空事件
        clearFilter(){
          this.filterData.screenBy.forEach(screen => {
            screen.data.forEach(item => {
              item.select= false
            })
          })
        },
        //确定事件
        filterOk(){
          let screenData = {//用于存放所有选中项
            MPI: "",//商家服务
            offer: "",//优惠活动
            per: ""//人均消费
          };
          let mpiStr='';//存放多选选中项
          this.filterData.screenBy.forEach(screen => {
            screen.data.forEach( item => {
              if(item.select){//如果有被选中的
                 // 两种情况 1.多选 2.单选
                if(screen.id!=='MPI'){
                  //单选
                  screenData[screen.id] = item.code;
                }else{
                  //多选
                  mpiStr += item.code +',';//拼接
                  screenData[screen.id] = mpiStr;
                }
              }
            })
          })
           // 更新数据
          this.$emit('updata',{condition:screenData});
          this.cancelOpen();
        }
    }
}
</script>

<style scoped>
.filter_wrap {
  background: #fff;
  position: sticky;
  top: 54px;
  z-index: 10;
}
.filter {
  position: relative;
  border-bottom: 1px solid #ddd;
  line-height: 10.4vw;
  z-index: 101;
  height: 10.666667vw;
  display: flex;
  justify-content: space-around;
}
.filter-nav {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 0.8333rem;
}
.filter-nav i {
  width: 1.6vw;
  height: 0.8vw;
  margin-left: 1.333333vw;
  margin-bottom: 0.533333vw;
  fill: #333;
  will-change: transform;
}

.filter-bold {
  font-weight: 600;
  color: #333;
}

.open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 3;
}

.filter-extend {
  background-color: #fff;
  color: #333;
  padding-top: 2.133333vw;
  position: absolute;
  width: 100%;
  z-index: 4;
  left: 0;
  top: 24.533333vw;
}
.filter-extend li {
  position: relative;
  padding-left: 5.333333vw;
  line-height: 10.666667vw;
  overflow: hidden;
}
.fa-check {
  float: right;
  color: #009eef;
  margin-right: 3.733333vw;
  line-height: 10.666667vw;
}

.selectName {
  color: #009eef;
}
/* 筛选 */
.filter-sort {
  background: #fff;
  padding: 0 2.666667vw;
  line-height: normal;
}
.morefilter {
  margin: 2.666667vw 0;
  overflow: hidden;
}
.morefilter .title {
  margin-bottom: 2vw;
  color: #666;
  font-size: 0.5rem;
}
.morefilter ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.morefilter li {
  box-sizing: border-box;
  width: 30%;
  height: 9.333333vw;
  line-height: 9.333333vw;
  margin: 0.8vw 1%;
  background: #fafafa;
}
.morefilter li img {
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: middle;
  margin-right: 0.8vw;
}
.morefilter li span {
  margin-left: 2%;
  vertical-align: middle;
}

.morefilter-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fafafa;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 11.466667vw;
  box-sizing: border-box;
}
.morefilter-btn span {
  font-size: 0.826667rem;
  text-align: center;
  text-decoration: none;
  flex: 1;
}
.morefilter-clear {
  color: #ddd;
  background: #fff;
}
.morefilter-ok {
  color: #fff;
  background: #00d762;
  border: 0.133333vw solid #00d762;
}

.selected {
  color: #3190e8 !important;
  background-color: #edf5ff !important;
}

.edit {
  color: #333 !important;
}
</style>
