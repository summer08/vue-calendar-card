<template>
  <div id="app">
    <div class="clock-calendar-wrapper">
      <div class="calendar-content">
        <calendar-slider @dateClick="dateClickHandle"></calendar-slider>
      </div>
    </div>
  </div>
</template>

<script>
  import calendarSlider from "./common/calendarSlider";
  import { GetQueryString } from '@/utils/http';
export default {
  name: 'App',
  components: {
    calendarSlider
  },
  mounted() {
    /*this.$http.get('/product/group/allList').then(res => {
      console.log(res)
    }).catch((err) => {
      console.log("router-err:", err);
    });
    let params = {
      articleId: "23",
      userId: "51"
    }
    this.$http.post('/sysConfig/userarticle/save',params).then(res => {
      console.log(res)
    })*/
  },
  methods: {
    repairZero(num) {
      return num < 10 ? '0' + num : num;
    },
    dateClickHandle (date, signInCode) {
      let dSplit = date.split('-');
      let dateNew = `${dSplit[0]}-${dSplit[1]}-${this.repairZero(dSplit[2])}`;
      console.log(dateNew)
      /*Client.health_calendar_clockIn({
        date: dateNew
      })*/
      /*if(signInCode == 1){
        this.$toast({
          duration: 1000, // 持续展示 toast
          message: '您已经打过卡了哦~~',
        });
      }else{
        Client.health_calendar_clockIn({
          date: dateNew
        })
      }*/
    }
  }
}
</script>

<style lang="scss" >
  .clock-calendar-wrapper {
    background: rgba(249, 250, 251, 1);
    min-height: 100vh;
    -webkit-overflow-scrolling: touch;
    .calendar-content {
      padding: 30px;
      //height: 856px;
      //height: 80vh;
      border-radius: 32px;

      .calendar_slider{
        .slider_item{
          .month{
            //height: 8%;
            height: 81px;
          }
          .weeks{
            //height: 6%;
            height: 73px;
          }
          .days{
            //height: 86%;
            height: auto;
            .day{
              height: 117px;
            }
          }
        }
      }
    }
  }
</style>
