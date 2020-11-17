<template>
  <el-dialog :modal-append-to-body="false" title="详情" :visible="true" width="1200px" :before-close="handleClose">
    <div class="flex" v-loading="loading">
      <div class="section" style="width:200px;margin-right: 20px">
        <p class="section-title small">订单时间线</p>
        <el-timeline style="margin-top:30px">
          <el-timeline-item :timestamp="message.info.create_time">用户发布需求</el-timeline-item>
          <template v-if="message.info.status == 10">
            <el-timeline-item :timestamp="message.info.examine_time">订单不成交</el-timeline-item>
          </template>
          <template v-else-if="message.info.status == 11">
            <el-timeline-item :timestamp="message.info.cancel_time">用户取消订单</el-timeline-item>
          </template>
          <template v-else-if="message.info.status == 12">
            <el-timeline-item :timestamp="message.info.cancel_time">超时未付款</el-timeline-item>
          </template>
          <template v-else-if="message.info.status == 14">
            <el-timeline-item :timestamp="message.info.cancel_time">超时未审核</el-timeline-item>
          </template>
          <template v-else>
            <el-timeline-item v-if="message.info.status > 1" :timestamp="message.info.examine_time">店长审核通过</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 2" :timestamp="message.pay.pay_time">用户支付</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 3" :timestamp="message.info.release_time">后台发布订单</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 4 && message.craftsmaninfo" :timestamp="message.craftsmaninfo.choose_time">师傅承接订单</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 5" :timestamp="message.ordersshow.time">师傅开始施工</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 5 && message.ordersshow.secctime" :timestamp="message.ordersshow.secctime">师傅结束施工</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 6" :timestamp="message.info.user_confirm_time">用户验收</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 7" :timestamp="message.info.success_time">店长验收</el-timeline-item>
            <el-timeline-item v-if="message.info.status > 6 && message.comment.time" :timestamp="message.comment.time">用户评价</el-timeline-item>
          </template>
        </el-timeline>
      </div>
      <div class="flex1" style="border-left: 1px solid #eee;padding-left: 20px">
        <div class="section detail-form">
          <p class="section-title small">订单信息</p>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="订单编号:">
                  <p class="flex-center-start">
                    <svg-icon v-if="message.info.urgent == 1" icon-class="urgent" />
                    <span style="margin-left:5px">{{ message.info.order_sn }}</span>
                  </p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单状态:">
                  <span>{{ orderStatus[message.info.status] }}</span>
                  <span v-if="message.info.qxremark">, {{ message.info.qxremark }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="承接网点:">
                  {{ message.info.networkname || '无'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="下单客户:">
                  {{ message.info.username }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务需求:">
                  {{ message.info.service_demand }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预约时间:">
                  {{ message.info.appo_time || '无'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系用户:">
                  {{ message.info.phone }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="服务地址:">
                  {{ message.info.address }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="维修详述:">
                  {{ message.info.remark || '无'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现场图片:">
                  <template v-if="message.userimglist.length">
                    <gd-image v-for="(item, index) in message.userimglist" :key="index" :src="item" />
                  </template>
                  <template v-else>
                    无
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <el-divider /> -->
        </div>
        <div class="section  detail-form" v-if="(message.info.status > 1 && message.info.status <= 8) || message.info.status == 10">
          <p class="section-title small">报价&报名</p>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="8" v-show="message.pay.total_price > 0">
                <el-form-item label="订单报价:">
                  <span class="bold">{{ (message.pay.total_price - message.pay.add_money) | normNumber }} 元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show="message.pay.total_price > 0">
                <el-form-item label="增项费用:">
                  <span class="bold">{{ message.pay.add_money || 0}} 元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show="message.pay.craftsman_price > 0">
                <el-form-item label="施工报价:">
                  <span class="bold">{{ message.pay.craftsman_price }} 元</span>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="message.pay.add_remark">
                <el-form-item label="增项说明:">
                  {{ message.pay.add_remark }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审核人:">
                  {{message.info.htremark}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核结果:">
                  {{ message.pay.total_price > 0 ? '成单' : '不成单'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <template v-if="message.craftsmaninfo">
                <el-col :span="8">
                  <el-form-item label="承接师傅:">
                    {{ message.craftsmaninfo.name }} （{{ message.craftsmaninfo.sn }}）
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系师傅:">
                    {{ message.craftsmaninfo.phone }}
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="报价单:">
                  <gd-image :src="message.pay.bjimg" />
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="message.info.success_img">
                <el-form-item label="结算单:">
                  <gd-image :src="message.info.success_img" />
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="message.info.status > 3 && message.info.status <= 8">
                <el-form-item label="报名情况:">
                  <template v-if="message.craftsmanlist.length">
                    <ul class="master-list">
                      <li v-for="(item, index) in message.craftsmanlist" :key="index">
                        <gd-image :src="item.headerurl" headUrl width="40" height="40" style="margin-top:0"/>
                        <div class="flex1" style="margin-left: 10px">
                          <p style="font-weight: bold">{{ item.name }} {{ item.sn }}</p>
                          <p><i class="el-icon-phone-outline" /> {{ item.phone }}</p>
                        </div>
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    无
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <el-divider /> -->
        </div>
        <div class="section  detail-form" v-if="message.info.status > 5 && message.info.status <= 8">
          <p class="section-title small">施工情况&用户评价</p>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="24" v-if="message.ordersshow">
                <el-form-item label="施工时间:">
                  <span>{{message.ordersshow.time}} 至 {{message.ordersshow.secctime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="message.ordersshow">
                <el-form-item label="施工情况:">
                  <gd-image v-if="message.ordersshow.imgurl1" :src="message.ordersshow.imgurl1" />
                  <gd-image v-if="message.ordersshow.imgurl3" :src="message.ordersshow.imgurl3" />
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="message.comment && message.comment.id">
                <el-form-item label="用户评价:" >
                  <div class="flex-center-start">
                    <el-rate
                      v-model="message.comment.stars"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                    <p>{{ message.comment.comment }}</p>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getDetails } from '@/api/order'

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      message: {
        info: {},
        comment: {},
        bjd: {},
        craftsmaninfo: null,
        ordersshow: {},
        pay: {},
        userimglist: []
      }
    }
  },
  computed: {
    ...mapState({
      orderStatus: state => state.dict.orderStatus
    })
  },

  created() {
    const that = this
    getDetails({
      order_id: that.dialogMes.id
    }).then(response => {
      this.loading = false
      for (const i in response.data) {
        if (response.data[i]) {
          that.message[i] = response.data[i]
        }
      }
    })
  },

  methods: {
    handleClose() {
      this.$parent.currentComponent = ''
    }
  }
}
</script>

<style scoped lang="scss">
.img-list img{
  width: 300px;
  height: 200px;
  border: 1px solid #f2f2f2;
  margin-right: 20px;
}

.master-list{
  display: flex;
  flex-wrap: wrap;
  li{
    width: 32%;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    line-height: 1.5;
    margin-right: 2%;
    padding: 10px;
    box-sizing: border-box;
    &:nth-of-type(3n){
      margin-right: 0;
    }
    img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
      background: #f2f2f2;
    }
  }
}
</style>
