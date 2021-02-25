<template>
  <div class="bbt-poster-helper">
    <div class="handle-bar">
      <div class="switch-wrap">
        <span class="switch-label">是否开启爬取模式：</span>
        <el-switch v-model="isStart" @change="switchChange"></el-switch>
      </div>
      <el-button
        type="primary"
        size="small"
        v-show="isShowList"
        @click="toCrawl"
      >
        爬取
      </el-button>
      <el-button size="small" v-show="isShowList">
        更新已爬取的模板
      </el-button>
    </div>
    <div class="helper-container" v-show="isShowList">
      <div class="container-header">
        <el-radio-group v-model="activeName" size="medium">
          <el-radio-button label="detaile">手机详情页海报</el-radio-button>
          <el-radio-button label="home">手机首页海报</el-radio-button>
          <el-radio-button label="pc">PC海报</el-radio-button>
        </el-radio-group>
        <el-button size="medium" @click="selectAll">
          {{ isAllSelect ? '取消全选' : '全选模板' }}
        </el-button>
      </div>
      <div class="list-wrapper">
        <div
          class="list"
          v-infinite-scroll="getItems"
          :infinite-scroll-disabled="disabled"
        >
          <div
            :class="[
              'item',
              crawledList.indexOf(item.id) > -1 ? 'crawled' : 'selectable',
              { active: selection.indexOf(item.id) > -1 }
            ]"
            v-for="(item, index) in items"
            @click="select(item, index)"
            :key="item.id"
          >
            <div
              :class="[
                'item-img',
                activeName === 'home' ? 'home-poster' : 'detaile-poster'
              ]"
            >
              <img :src="item.preview.url" />
            </div>
            <!-- <i class="el-icon-check"></i> -->
            <!-- <el-checkbox
              class="check-box"
              v-model="item.checked"
              size="medium"
            ></el-checkbox> -->
            <div class="check-box">
              <div class="check-icon"></div>
            </div>
            <div class="tag">已爬取</div>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
        <p class="loading-tips" v-if="loading">加载中...</p>
        <p class="loading-tips" v-if="noMore">没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Switch,
  Tabs,
  TabPane,
  Checkbox,
  RadioGroup,
  RadioButton,
  InfiniteScroll
} from 'element-ui'
import Vue from 'vue'
Vue.use(Button)
Vue.use(Switch)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(TabPane)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(InfiniteScroll)

export default {
  name: 'listContent',
  data() {
    return {
      pageNo: 1,
      isStart: false,
      activeName: 'detaile',
      isShowList: false,
      items: [],
      loading: false,
      noMore: false,
      crawledList: [],
      selection: [],
      selectable: []
    }
  },
  created() {
    this.getItems()
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    },
    isAllSelect() {
      return this.selection.length === this.selectable.length
    }
  },
  methods: {
    injectList() {
      let parent = document.querySelector('.poster-share')
      let list = document.querySelector('.poster-list')
      parent.removeChild(list)
      parent.appendChild(this.$el)
    },
    getItems() {
      let params = {
        filter_id: '1611627,1612133,1612144,1612134',
        page_num: this.pageNo,
        page_size: 20,
        from: 2
      }
      this.loading = true
      axios
        .get('/material/search', { params })
        .then(items => {
          this.loading = false
          if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
              item.checked = false
              this.selectable.push(item.id)
              this.items.push(item)
            })
            this.pageNo++
          } else {
            this.noMore = true
          }
        })
        .catch(err => {
          this.loading = false
          this.noMore = true
          throw err
        })
    },
    switchChange(val) {
      this.isStart = val
      let category = document.querySelector('.poster-category')
      let sort = document.querySelector('.category-sort')
      let list = document.querySelector('.poster-list')
      category.style.display = val ? 'none' : 'block'
      sort.style.display = val ? 'none' : 'block'
      list.style.display = val ? 'none' : 'block'
      this.isShowList = val
    },
    select(item) {
      let index = this.selection.indexOf(item.id)
      if (index === -1) {
        this.selection.push(item.id)
      } else {
        this.selection.splice(index, 1)
      }
    },
    selectAll() {
      if (this.isAllSelect) {
        this.selection = []
      } else {
        this.selectable.forEach(item => {
          if (this.selection.indexOf(item) === -1) {
            this.selection.push(item)
          }
        })
      }
    },
    toCrawl() {
      if (!this.selection.length) {
        // return alert('请勾选需要爬取的海报')
        this.message({
          message: '信息提醒',
          type: 'info'
        })
        // console.error('请勾选需要爬取的海报');
      }
    },
    howTips(msg, failCount, type) {
      if (failCount) {
        msg =
          msg + `，还有${failCount}个商品投放失败，可能是因为商品没有装修详情`
      }
      let loadDom = document.querySelector('#loadDiv')
      if (loadDom !== null) {
        document.body.removeChild(loadDom)
      }

      let overlayTips = document.createElement('div')
      overlayTips.setAttribute('id', 'overlayTips')
      let href
      if (type == 2) {
        href = 'http://promote.baobeituan.com/activity/coupon/index'
      } else if (type == 99) {
        href =
          'http://promote.baobeituan.com/template/posterList?status=onGoing'
      } else {
        href = 'http://promote.baobeituan.com/template/templateList'
      }
      overlayTips.innerHTML = `
	<div class="next-overlay-wrapper opened">
		<div class="next-overlay-backdrop"></div>
		<div class="next-overlay-inner animated fadeInDown toast-confirm-warp next-position-cc" style="position: fixed;left: 50%;margin-left: -210px;top:325px;">
			<div class="toast-type"><i class="iconfont icon-tishidengpao"></i></div>
			<div class="toast-body">${msg}</div>
			<div class="toast-footer">
				<button type="button" class="next-btn next-btn-normal next-btn-medium ok-btn" onclick="history.go(0)">留在本页</button>
				<div class="separator-line"></div>
				<button type="button" class="next-btn next-btn-normal next-btn-medium cancel-btn">
					<a href="${href}">返回宝贝团</a>
				</button>
			</div>
		</div>
	</div>`
      document.body.appendChild(overlayTips)
    }
  }
}
</script>

<style lang="scss">
@import './styles';
</style>
