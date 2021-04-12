<template>
  <div
    class="calendar_slider"
    ref="sliders">
    <div class="calendar_slider-content">
    <template  v-for="(month, index) in calendars">
      <div class="slider_item">
        <div class="month"><span ref="currentMonth">{{month[1][0].date.substr(0, 7)}}</span></div>
        <div class="weeks">
          <div v-for="(week,index) in weeks" :key="index">{{week}}</div>
        </div>
        <div class="days">
          <template v-for="week in month">
            <template v-for="day in week">
              <div class="day"  :class="{'not_current_month': !day.isCurrentMonth}">
                <div class="date"  @click="dateClickHandle(day.date , day.signInCode)" :class="{'date_pink': day.status == 1,'date_orange': day.status == 2,'date_green': day.status == 3}">
                  {{day.date.split('-')[2]}}
                  <div class="event_tag" v-if="day.signInCode == 0 || day.signInCode == 1">
                    <span class="no-checked" :class="{'no-checked': day.signInCode == 0, 'y-checked': day.signInCode == 1 }"></span>
                  </div>
                </div>

                <!--<div class="event_num" v-if="day.isCurrentMonth && day.signInCode">{{day.signInCode}}</div>-->
              </div>
            </template>
          </template>
        </div>

        <div class="mask_sun" style="">{{(month[1][0].date).split('-')[1].replace(/\b(0+)/gi,"")}}</div>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
  import { GetQueryString } from '@/utils/http';
  import monthUtil from './monthUtil.js'
  let curDate = GetQueryString('date') && GetQueryString('date').split('-')

  export default {
    name: 'calendarSlider',
    props: {
      defaultActiveMonth: {
        type: String,
        default: monthUtil.getDefaultMonthStr()
      }
    },
    data() {
      return {
        events: [],
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        //weeks: ['一', '二', '三', '四', '五', '六', '日'],
        modalVisible: true,
        calendars: [],
        defaultMonth: curDate ? `${curDate[0]}-${curDate[1]}` : this.defaultActiveMonth || monthUtil.getDefaultMonthStr(),

      }
    },
    computed: {
      //获取当月附近的两个月
      startDates() {
        let vm = this
        //let now = monthUtil.getDefaultMonthStr(vm.defaultMonth);
        let now = vm.defaultMonth;
        console.log(now)
        console.log(vm.defaultMonth)
        let prevMonth = now.split('-')[1].startsWith('0') ? (now.split('-')[1]).substr(1) : now.split('-')[1]
        let d = new Date(vm.defaultMonth);
        console.log(1,d)
        var result = [];
        for(let i = 0; i < prevMonth; i++) {
          let s = i == 0 ? d.getMonth() : d.getMonth() - 1;
          d.setMonth(s);
          var m = d.getMonth() + 1;
          console.log(m)
          m = m < 10 ? "0" + m : m;
          result.push(d.getFullYear() + "-" + m + "-" +  "01");
        }
        console.log(333,result)
        return result
      }
    },
    watch: {
      /*defaultMonth: {
        handler: function (newVal) {
          for (var i = 0; i < this.startDates.length; i++) {
            this.getWeeksDates(this.startDates[i])
          }
        },
        deep: true
      },*/
      events: {
        handler: function (newVal) {
          this.calendars = []
          for (var i = this.startDates.length - 1; i!=-1; i--) {
            this.getWeeksDates(this.startDates[i])
          }
          /*for (var i = 0; i < this.startDates.length; i++) {
            this.getWeeksDates(this.startDates[i])
          }*/
        },
        deep: true
      }
    },
    mounted() {
      this.sliderHeight = this.$refs.sliders.offsetHeight
    },
    created() {
      let vm = this
      /*for (var i = 0; i < this.startDates.length; i++) {
        this.getWeeksDates(this.startDates[i])
      }*/
      for (var i = this.startDates.length - 1; i!=-1; i--) {
        this.getWeeksDates(this.startDates[i])
      }
      this.getInit(curDate ? `${curDate[0]}-${curDate[1]}` : this.defaultActiveMonth || monthUtil.getDefaultMonthStr())
    },
    methods: {
      getInit(date){
        //this.$store.commit('showLoading')
        this.$http.get(`/member/dayclockin/clockInCalendar/51/${date}`).then(res=>{
          if (res && res.code === 0) {
            let list = res.data
            this.events = list.map((item,index) => {
              let obj = {};
              obj.date = item.createTime
              obj.signInCode = item.signInCode
              obj.status = item.status
              obj.isClick = item.signInCode
              return obj
            })
          } else {
            // this.$toast.fail(res.data.msg);
          }
          //this.$store.commit('hideLoading')
        })
      },
      //点击日历事件
      dateClickHandle(date,signInCode) {
        this.$emit('dateClick', date,signInCode)
      },

      /**
       * @name getWeeksDates
       * @description 根据日期获取月数据
       * @param date {YYYY-MM-DD:String} 月开始日期
       */
      getWeeksDates(date) {
        let vm = this,
          now = new Date(),
          current = new Date(date),
          startDate = new Date(date),
          startWeekDay = startDate.getDay()  //每月第一天周几
        startDate.setDate(startDate.getDate() - startWeekDay)
        let calendar = []
        for (var i = 0; i < 6; i++) {
          var week = []
          for (var k = 0; k < 7; k++) {
            week.push({
              theDay: startDate.getDate(),
              isToday: now.toDateString() == startDate.toDateString(),
              isCurrentMonth: current.getFullYear() === startDate.getFullYear() && current.getMonth() === startDate.getMonth(),
              weekDay: k,
              date: monthUtil.date2str(startDate),
              signInCode: vm.markEvent(vm.events, monthUtil.date2str(startDate)),
              status: vm.markEventStatus(vm.events, monthUtil.date2str(startDate))
            })
            startDate.setDate(startDate.getDate() + 1)
          }
          calendar.push(week)
        }
        vm.calendars.push(calendar)

      },

      /**
       * @name markEvent
       * @description 标记当前日期是否有事务
       * @param events {Array} 当前月的事务列表
       * @param date {YYYY-MM-DD:String} 日期
       */
      markEvent(events, date) {
        for (var i = 0; i < events.length; i++) {
          let arr = events[i].date.split('-');
          let str = arr[2].replace(/\b(0+)/gi,"");
          let newArr = `${arr[0]}-${arr[1]}-${str}`
          if (newArr == date) {
            return events[i].signInCode
          }
        }
      },

      markEventStatus(events, date) {
        for (var i = 0; i < events.length; i++) {
          let arr = events[i].date.split('-');
          let str = arr[2].replace(/\b(0+)/gi,"");
          let newArr = `${arr[0]}-${arr[1]}-${str}`
          if (newArr == date) {
            return events[i].status
          }
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .calendar_slider {
    height: 100%;
    position: relative;
    overflow: hidden;
    .calendar_slider-content{

    }
    .slider_item {
      margin-bottom: 60px;
      height: 856px;
      border-radius: 32px;
      box-shadow: 0 2px 12px 0 rgba(100, 101, 102, 0.12);
      /*width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      left: 0;
      top: 0;*/
      background: #fff;
      .month {
        display: table;
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #333;

        span {
          display: table-cell;
          vertical-align: middle;
          font-weight: bold;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: rgba(50, 50, 51, 1);
        }
      }

      .weeks {
        display: flex;
        border-bottom: #ddd solid 1px;
        align-items: center;
        justify-content: center;
        height: 4%;

        div {
          flex: 1;
          text-align: center;
          color: #666;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: rgba(50, 50, 51, 1);
        }
      }

      .days {
        height: 90%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        align-content: flex-start;

        .day {
          height: 16.65%;
          width: 14.28%;
          position: relative;
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          &.not_current_month {
            visibility: hidden;
            .date{
              color: rgba(200, 201, 204, 1);
              &.date_pink {
                background: #FD73A7;
                color: #fff;
                border-radius: 50%;
              }
              &.date_orange {
                background: rgba(254, 192, 22, 1);
                color: #fff;
                border-radius: 50%;
              }
              &.date_green {
                background: rgba(0, 200, 197, 1);
                color: #fff;
                border-radius: 50%;
              }
            }
          }

          .date {
            width: 72px;
            height: 72px;
            text-align: center;
            line-height: 72px;
            /*padding: 18px;*/
            position: relative;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(50, 50, 51, 1);
            cursor: pointer;
            .event_tag {
              position: absolute;
              right: -8px;
              bottom: -24px;

              span {
                display: inline-block;
                width: 27px;
                height: 27px;

                &.no-checked {
                  //background: url("../../assets/images/un-checked.png");
                  background-size: 100%;
                }

                &.y-checked {
                  //background: url("../../assets/images/y-checked.png");
                  background-size: 100%;
                }
              }
            }

            //line-height: 24px;
            &.date_pink {
              background: #FD73A7;
              color: #fff;
              border-radius: 50%;
            }
            &.date_orange {
              background: rgba(254, 192, 22, 1);
              color: #fff;
              border-radius: 50%;
            }

            &.date_green {
              background: rgba(0, 200, 197, 1);
              color: #fff;
              border-radius: 50%;
            }
          }

          .event_num {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 12px;
            width: 24px;
            height: 24px;
            background-color: #dd3629;
            color: #FFF;
            text-align: center;
            line-height: 24px;
            border-radius: 50%;
          }
        }
      }

      .mask_sun {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        font-family: Avenir-Medium, Avenir;
        font-size: 320px;
        color: rgba(242, 243, 245, .8);
      }
    }
  }

  .events_modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    max-width: 750px;
    width: 100%;
    z-index: 999;
    transition: all 0.2s linear;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .main {
        background: #FFF;
        transition: all 0.2s linear;
      }
    }
  }


</style>
