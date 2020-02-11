<template>
    <div class="Rating-gray">
        <i class="fa" v-for="(item,index) in itemClasses" :key="index" :class="item"></i>
    </div>
</template>

<script>
// 星星长度
const LENGTH = 5;
// 星星对应的class
const CLS_ON = "fa-star";//全星
const CLS_HALF = "fa-star-half-empty";//半星
const CLS_OFF = "fa-star-o";//空心补齐
export default {
    name:'rating',
    props: {
        rating: Number
    },
    computed: {
        itemClasses(){
            //存放星星的数组
            let result = [];
            // 对分数进行处理, 向下取0.5的倍数
            //  4.8*2=9.6 --> 9  /2=4.5
            //  4.3*2=8.6 --> 8  /2=4
            let score = Math.floor(this.rating * 2) / 2;
            // 控制半星  判断是否有小数
            let hasDecimal = score % 1 !== 0;//小数
            // 全星
            let integer = Math.floor(score)
            // 全星放入到数组中
            for(let i=0;i<integer;i++){
                result.push(CLS_ON)
            }
            // 半星
            if(hasDecimal){
                result.push(CLS_HALF)
            }
            // 补齐
            if(result.length < LENGTH){
                result.push(CLS_OFF)
            }
            return result
        }
    }
}
</script>

<style scoped>
.Rating-gray {
  margin-right: 1.066667vw;
  color: #ffbe00;
  display: inline-block;
}
</style>
