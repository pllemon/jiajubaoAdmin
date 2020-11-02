<template>
  <div class="header flex-center-between">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <div class="system-title" style="font-size:22px;font-weight:500">多师傅管理平台</div>
    <div class="flex-center-start">
      <Menu />
    </div>
    <div class="flex-center">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>
          {{ userInfo.username }} 
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">账号信息</el-dropdown-item>
          <el-dropdown-item command="2">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <p @click="showNews()" style="padding: 0 20px;cursor:pointer" v-show="newsLength">
        <el-badge :value="newsLength" class="item">
          <i class="el-icon-bell animated swing infinite" style="font-size:18px;display:block;position:relative;top:-1px" />
        </el-badge>
      </p>
    </div>

     <!-- 全局消息弹窗 -->
    <el-dialog
      title="消息中心"
      :modal-append-to-body="false"
      :visible.sync="showNewsDialog"
      width="700px"
      :before-close="closeNews">
      <ul class="news-list">
        <li @click="goOrder('makeOrder', 1)" class="flex" v-if="newList.makeOrder && newList.makeOrder.length">
          <el-badge :value="newList.makeOrder.length" class="item">
            <i class="task-icon el-icon-s-claim" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">新订单</p>
            <p class="news-dec" v-for="(item,index) in newList.makeOrder" :key="index">
              <span class="time">{{item.addTime}}</span> 用户 {{item.name}}（{{item.phone}}）下了个新订单，请及时处理！
            </p>
          </div>
        </li>
        <li @click="goOrder('payEarnest', 3)" class="flex" v-if="newList.payEarnest && newList.payEarnest.length">
          <el-badge :value="newList.payEarnest.length" class="item">
            <i class="task-icon el-icon-s-finance" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">用户已支付</p>
            <p class="news-dec" v-for="(item,index) in newList.payEarnest" :key="index">
              <span class="time">{{item.addTime}}</span> 订单编号 {{item.orderSn}}，用户已支付，请及时处理！,
            </p>
          </div>
        </li>
        <li @click="goMaster()" class="flex" v-if="newList.newMaster && newList.newMaster.length">
          <el-badge :value="newList.newMaster.length" class="item">
            <i class="task-icon el-icon-user-solid" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">师傅申请</p>
            <p class="news-dec" v-for="(item,index) in newList.newMaster" :key="index">
              <span class="time">{{item.addTime}}</span> 用户 {{item.name}}（{{item.phone}}）申请成为师傅，请及时处理！
            </p>
          </div>
        </li>
        <li @click="goBusinessman()" class="flex" v-if="newList.newBusiness && newList.newBusiness.length">
          <el-badge :value="newList.newBusiness.length" class="item">
            <i class="task-icon el-icon-s-custom" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">商家申请</p>
            <p class="news-dec" v-for="(item,index) in newList.newBusiness" :key="index">
              <span class="time">{{item.addTime}}</span> 用户 {{item.name}}（{{item.phone}}）申请成为商家，请及时处理！
            </p>
          </div>
        </li>
        <li @click="goMasterApply()" class="flex" v-if="newList.crafSetTlement && newList.crafSetTlement.length">
          <el-badge :value="newList.crafSetTlement.length" class="item">
            <i class="task-icon el-icon-s-finance" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">师傅申请提现（一期）</p>
            <p class="news-dec" v-for="(item,index) in newList.crafSetTlement" :key="index">
              <span class="time">{{item.addTime}}</span> {{item.name}}申请提现{{item.money}}元，请及时处理！
            </p>
          </div>
        </li>
        <li @click="goMasterApply2()" class="flex" v-if="newList.crafSetTlement2 && newList.crafSetTlement2.length">
          <el-badge :value="newList.crafSetTlement2.length" class="item">
            <i class="task-icon el-icon-s-finance" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">师傅申请提现（二期）</p>
            <p class="news-dec" v-for="(item,index) in newList.crafSetTlement2" :key="index">
              <span class="time">{{item.addTime}}</span> {{item.name}}申请提现{{item.money}}元，请及时处理！
            </p>
          </div>
        </li>
        <li @click="goMemberApply()" class="flex" v-if="newList.userSetTlement && newList.userSetTlement.length">
          <el-badge :value="newList.userSetTlement.length" class="item">
            <i class="task-icon el-icon-s-finance" />
          </el-badge>
          <div class="news-mes">
            <p class="news-title">用户申请提现</p>
            <p class="news-dec" v-for="(item,index) in newList.userSetTlement" :key="index">
              <span class="time">{{item.addTime}}</span> {{item.name}}申请提现{{item.money}}元，请及时处理！
            </p>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Menu from '@/components/Menu'
import { worksend } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Menu

  },
  data() {
    return {
      showNewsDialog: false,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'newList'
    ]),
    newsLength() {
      let newsSum = 0
      for (let i in this.newList) {
        newsSum += this.newList[i].length
      }
      return newsSum
    }
  },
  create() {
    console.log(this.newList)
  },
  methods: {
    goOrder(type, status) {
      this.$store.commit('news/REMOVE_NEWS', type)
      this.showNewsDialog = false
      if (status == 1) {
        this.$router.push('/order/list?status=1&menu=1-1&section=1&currTime' + new Date().getTime())
      } else if (status == 3) {
        this.$router.push('/order/list?status=3&menu=1-3&section=1&currTime' + new Date().getTime())
      }
    },
    goMaster() {
      this.$store.commit('news/REMOVE_NEWS', 'newMaster')
      this.showNewsDialog = false
      this.$router.push('/master/list?currTime' + new Date().getTime())
    },
    goBusinessman() {
      this.$store.commit('news/REMOVE_NEWS', 'newBusiness')
      this.showNewsDialog = false
      this.$router.push('/businessman/list?currTime' + new Date().getTime())
    },
    goMasterApply() {
      this.$store.commit('news/REMOVE_NEWS', 'crafSetTlement')
      this.showNewsDialog = false
      this.$router.push('/master/settlement?number=1&menu=4-1&currTime' + new Date().getTime())
    },
    goMasterApply2() {
      this.$store.commit('news/REMOVE_NEWS', 'crafSetTlement2')
      this.showNewsDialog = false
      this.$router.push('/master/settlement?number=2&menu=4-4&currTime' + new Date().getTime())
    },
    goMemberApply() {
      this.$store.commit('news/REMOVE_NEWS', 'userSetTlement')
      this.showNewsDialog = false
      this.$router.push('/member/settlement?currTime' + new Date().getTime())
    },

    showNews() {
      this.showNewsDialog = true;
    },
    closeNews() {
      this.showNewsDialog = false;
    },

    handleCommand(command) {
      if (command == 2) {
        this.$confirm('确定退出该账号？', '提示', {
          type: 'warning'
        }).then(() => {
          this.logout()
        }).catch()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 60px;
  background: #4279de;
  color: #fff;
  flex-shrink: 0;
  padding: 0 25px;
  .title{
    font-size: 28px;
    margin-right: 10px;
  }
  .el-dropdown{
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }
}
.dropdown{
  border: 1px solid #f8f8f8;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px !important;
}


.task-icon {
  font-size: 22px;
  &.el-icon-s-custom,
  &.el-icon-user-solid{
    color: #409EFF;
  }
  &.el-icon-s-finance{
    color: #E6A23C;
  }
  &.el-icon-s-claim{
    color: #67C23A;
  }
}
.news-list{
  li{
    border: 1px solid #dcdcdc;
    padding: 10px;
    margin-bottom: 10px;
    line-height: 1.5;
    cursor: pointer;
    &:hover{
      border-color: #409EFF;
    }
    .svg-icon{
      font-size: 16px;
      color: #888;
    }
    .news-mes{
      margin-left: 15px;
      .news-title{
        font-size: 15px;
        margin-bottom: 5px;
        margin-top: 1px;
        color: #333;
        font-weight: bold;
      }
      .time{
        color: #333;
      }
      .news-dec{
        font-size: 12px;
        color: #666;
      }
    }
  }
}

</style>