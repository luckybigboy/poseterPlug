import Vue from 'vue'
import listContent from './index.vue'
import initAxios from './assets/js/axiosPreset'
let hash = window.location.hash
let onWinLoaded = () => {
  if (hash.indexOf('#/poster') > -1) {
    // console.log(document.querySelector('.poster-list'))
    let helperWrap = document.createElement('div')
    helperWrap.className = 'bbt-helper-wrap'
    let posterShare = document.querySelector('.poster-share')
    posterShare.appendChild(helperWrap)
    initAxios()
    let main = {
      render: h => h(listContent)
    }
    let Content = Vue.extend(main)
    new Content().$mount('.bbt-helper-wrap')
  }
}
window.addEventListener('load', onWinLoaded)
