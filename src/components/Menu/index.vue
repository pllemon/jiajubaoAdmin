<template>
  <el-menu :default-active="activeIndex" mode="horizontal">
    <!-- <el-menu-item index="0">
      <router-link class="menu-link" to="/"><i class="el-icon-data-analysis"></i>所有订单</router-link>
    </el-menu-item> -->
    <el-submenu v-for="(item, index) in menuData" :key="index" :index="item.id">
      <template slot="title">
        <i class="submenu-icon" :class="item.icon"></i>
        <span class="submenu-title">{{item.title}}</span>
      </template> 
      <el-menu-item v-for="(item2, index2) in item.children" :key="index2" :index="item2.id">
        <router-link class="menu-link" :to="item2.path">{{item2.title}}</router-link>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { menuData } from '@/utils/menu'

export default {
  data() {
    return {
      activeIndex: '/system/concat',
      menuData
    }
  },
  created() {
    this.setActive(this.$route)
  },
  methods: {
    setActive(route) {
      const menu =  route.query.menu || route.meta.menu
      this.activeIndex = menu
    }
  },
  watch: {
    '$route': {
      handler(to, from) {
        this.setActive(to)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.el-menu{
  background: none;
  .el-menu-item i{
    color: #fff;
    position: relative;
    top: -2px;
  }
  .el-submenu{
    &:hover{
      .el-submenu__title{
        color: #fff;
        padding: 0;
        i {
          color: #fff;
        }
      }
    }
    .el-submenu__title{
      color: #fff;
      i{
        color: #fff;
        position: relative;
        top: -2px;
      } 
    }
  }
}
.el-menu--horizontal>.el-submenu .el-submenu__icon-arrow{
  display: none;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
  background: none;
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
  color: #fff;
}
.el-submenu__title:focus, .el-submenu__title:hover{
  background: none;
}
.el-menu--horizontal>.el-submenu:focus .el-submenu__title, 
.el-menu--horizontal>.el-submenu:hover .el-submenu__title,
.el-menu--horizontal>.el-menu-item a, 
.el-menu--horizontal>.el-menu-item a:hover{
  color: #fff;
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 2px solid #81efff;
  color: #81efff;
  font-weight: bold;
  i{
    color: #81efff;
  }
}
.el-menu--horizontal>.el-menu-item.is-active a{
  color: #81efff;
}
.el-menu--horizontal>.el-submenu .el-submenu__title,
.el-menu--horizontal>.el-menu-item{
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin: 0 15px;
  font-size: 16px;
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
.el-menu--popup{
  background: #fff;
}

.menu-link{
  display: block;
  width: 100%;
  height: 100%;
}
.el-menu-item.is-active{
  color: #409EFF !important;
}
</style>