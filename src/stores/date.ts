import { defineStore } from "pinia"
import moment from "moment"
// 从周一开始
moment.updateLocale('en', {
  week: {
    dow: 1
  }
})

type DateTag = 'today' | 'week' | 'month' | 'year'

export const useDateStore = defineStore("date", {
  state: () => {
    let tag:DateTag = 'today'
    return {
      tag
    }
  },
  getters: {
    getDateRange(state) {
      if(state.tag == 'today') {
        return {
          datebeg: moment().format('yyyyMMDD'),
          dateend: moment().format('yyyyMMDD')
        }
      }else if(state.tag == 'week') {
        return {
          datebeg: moment().startOf('week').format('yyyyMMDD'),
          dateend: moment().format('yyyyMMDD')
        }
      }else if(state.tag == 'month') {
        return {
          datebeg: moment().startOf('month').format('yyyyMMDD'),
          dateend: moment().format('yyyyMMDD')
        }
      }else if(state.tag == 'year') {
        return {
          datebeg: moment().startOf('year').format('yyyyMMDD'),
          dateend: moment().format('yyyyMMDD')
        }
      }
    }
  }
})