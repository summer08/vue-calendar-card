let monthUtil = {
  //获取当前年月
  getDefaultMonthStr() {
    let now = new Date()
    return now.getFullYear() + '-' + this.repairZero(now.getMonth() + 1)
  },

  //获取当前月份
  getNowMonthStartStr(dateStr) {
    return dateStr + '-' + '01'
  },

  //获取当前月份的上一月
  getPrevMonthStartStr(dateStr) {
    let year = Number(dateStr.split('-')[0])
    let month = Number(dateStr.split('-')[1])
    if (month === 1) {
      month = 12
      --year
    } else {
      --month
    }
    return year + '-' + this.repairZero(month) + '-' + '01'
  },

  //获取当前月份的下一月
  getNextMonthStartStr(dateStr) {
    let year = Number(dateStr.split('-')[0])
    let month = Number(dateStr.split('-')[1])
    if (month === 12) {
      month = 1
      ++year
    } else {
      ++month
    }
    return year + '-' + this.repairZero(month) + '-' + '01'
  },

  date2str(date) {
    return date.getFullYear() + '-' + this.repairZero(date.getMonth() + 1) + '-' + (date.getDate())
    //return date.getFullYear() + '-' + this.repairZero(date.getMonth()+1) + '-' + this.repairZero(date.getDate())
  },

  repairZero(num) {
    return num < 10 ? '0' + num : num;
  }

}

export default monthUtil
