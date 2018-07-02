<template>
	<transition name="slide">
		<div id="placeOrder" v-if="goods.piece != undefined">
			<div class="address" v-for="(item,index) in addressList" @click="goAddress" v-if="item.type === 1" :key="index">
				<div class="name-phone">
					<div>
						<span>收件人:{{item.name}}</span>
						<span>默认</span>
					</div>
					<div>{{item.phone}}</div>
				</div>
				<div class="address-text">
					地址: {{item.province}}{{item.city}}{{item.area}}{{item.address}}
				</div>
			</div>
			<div class="commodity-info" v-for="(item,index) in goods.list">
				<div class="icon"><img :src="item.picture_url" alt="" /></div>
				<div class="name">
					<p>{{item.goods_name}}</p>
					<!--<p>冬季男士插色休闲长袖夹克外套</p>
					<p>颜色：条纹蓝</p>-->
				</div>
				<div class="money">
					<p>￥{{item.price}}</p>
					<p>X{{item.num}}</p>
				</div>
			</div>
			<div class="cost-box">
				<div>
					<mt-cell title="商品合计">
						<span style="color: #ff9701;font-size: 13px;">￥{{goods.count.toFixed(2)}}</span>
					</mt-cell>
				</div>
				<!--<div>
					<mt-cell title="运费">
						<span style="color: #ff9701;font-size: 11px;">￥0.00</span>
					</mt-cell>
				</div>-->
				<div>
					<mt-field label="买家留言:" placeholder="选填：填写内容已和卖家协商确认" v-model="remark"></mt-field>
				</div>
				<div>
					<span>共{{goods.piece}}件商品</span>
					<span>小计:
						<b>￥{{goods.count.toFixed(2)}}</b>
					</span>
				</div>
			</div>
			<div class="flex-bottom">
				<div>合计 ：
					<span>￥{{goods.count.toFixed(2)}}</span>
				</div>
				<div @click="wxconfigInit">提交订单</div>
			</div>
		</div>
	</transition>

</template>

<script>
import wx from "weixin-js-sdk";
import { MessageBox } from "mint-ui";
import { WxConfig } from "api/wxapi";
import { ERR_CODE } from "api/config";
import { AddressList } from "api/address";
import { UserInfo } from "common/js/common";
import { ShowToast, Loading } from "common/js/loading-toast";
export default {
  data() {
    return {
      remark: "",
      goods: {},
      addressId: "",
      userInfo: "",
      addressList: []
    };
  },
  methods: {
    wxconfigInit() {
      if (this.addressId === "") {
        MessageBox.confirm("请添加默认地址")
          .then(action => {
            this.$router.push({
              path: "/my-address"
            });
          })
          .catch(res => {});
        return;
      }
      let options = {
        openid: this.userInfo.openId,
        remark: this.remark,
        addressId: this.addressId,
        total_fee: this.goods.count.toFixed(2),
        goodsList: this.goods.goodsList
      };
      let that = this;
      WxConfig(options).then(res => {
        let data = res.data;
        let options = res.data;
        options = JSON.stringify(options);
        localStorage.setItem("wxconfig", options);
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonce_str, // 必填，生成签名的随机串
          signature: data.paySign, // 必填，签名，见附录1
          jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
          that.addCart(data);
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        wx.error(function(res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });
    },
    getAddressList() {
      AddressList(this.userInfo.openId)
        .then(res => {
          if (res.data.code === ERR_CODE) {
            this.addressList = res.data.data;
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].type === 1) {
                this.addressId = res.data.data[i].id;
              }
            }
          }
        })
        .catch(res => {});
    },
    addCart(data) {
      Loading();
      //				let wxconfig = window.localStorage.getItem('wxconfig');
      //				wxconfig = wxconfig ? JSON.parse(wxconfig) : '';
      wx.chooseWXPay({
        timestamp: data.timeStamp, // 支付签名时间戳
        nonceStr: data.nonce_str, // 支付签名随机串，不长于32 位
        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign, // 支付签名
        success: function(res) {
          console.log(res);
          Loading(true);
          //支付成功
          ShowToast("支付成功");
        },
        cancel: function(res) {
          Loading(true);
          ShowToast("取消支付");

          //支付取消
        },
        fail: function(res) {
          Loading(true);
          ShowToast("支付失败");
        }
      });
    },
    goAddress() {
      this.$router.push({
        path: "/my-address"
      });
    }
  },
  created() {
    if (!this.$route.params.piece) {
      this.$router.push({
        path: "/shoppingCart"
      });
      return;
    }
    this.goods = this.$route.params;
  },
  mounted() {
    this.userInfo = UserInfo();
    this.getAddressList();
  },
  watch: {
    $route(val) {
      console.log(val);

      if (val.path === "/placeOrder") {
        this.getAddressList();
      }
    }
  }

  //		beforeRouteLeave(to, from, next) {
  //			this.goods = {};
  //			localStorage.removeItem('payInfo');
  //	        next();
  //		},
};
</script>

<style scoped>
#placeOrder {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #f5f5f5;
  z-index: 999;
  overflow: scroll;
}

.address {
  background: #fff;
  padding: 10px 15px;
  color: #666;
  font-size: 12px;
  position: relative;
}

.address:after {
  position: absolute;
  content: "";
  width: 6px;
  height: 12px;
  background: url(./right.png) no-repeat center center;
  background-size: 6px 12px;
  right: 10px;
  top: 50%;
  margin-top: -6px;
}

.name-phone {
  display: flex;
  font-size: 13px;
  color: #333;
  margin-bottom: 9px;
  padding-right: 20px;
}

.name-phone > div {
  flex: 1;
}

.name-phone span:nth-of-type(2) {
  display: inline-block;
  width: 29px;
  height: 12px;
  border: 1px solid #ff9701;
  border-radius: 3px;
  text-align: center;
  line-height: 12px;
  font-size: 10px;
  color: #ff9701;
}

.name-phone > div:nth-of-type(2) {
  text-align: right;
}

.address-text {
  padding-right: 20px;
}

.commodity-info {
  background: #fff;
  margin: 10px 0;
  padding: 10px 15px;
  border: none;
}

.cost-box {
  padding-left: 15px;
  background: #fff;
  margin-bottom: 100px;
}

.cost-box > div {
  padding-right: 10px;
  background-image: linear-gradient(
    180deg,
    #d9d9d9,
    #d9d9d9 50%,
    transparent 50%
  );
  background-size: 120% 1px;
  background-repeat: no-repeat;
  background-position: top left;
}

.cost-box > div:nth-of-type(3) {
  line-height: 48px;
  text-align: right;
  color: #333333;
  font-size: 13px;
  padding-right: 18px;
  background-image: none;
}

.cost-box > div:nth-of-type(3) span:nth-of-type(2) {
  display: inline-block;
  margin-left: 10px;
}

b {
  color: #ff9702;
}

.flex-bottom {
  position: fixed;
  width: 100%;
  height: 45px;
  line-height: 45px;
  bottom: 0;
  left: 0;
  background-color: #fff;
  background-image: linear-gradient(
    180deg,
    #d9d9d9,
    #d9d9d9 50%,
    transparent 50%
  );
  background-size: 120% 1px;
  background-repeat: no-repeat;
  background-position: top left;
  display: flex;
}

.flex-bottom > div:nth-of-type(1) {
  flex: 1;
  text-align: right;
  font-size: 13px;
  color: #333;
  margin-right: 10px;
}

.flex-bottom > div:nth-of-type(2) {
  flex: 0 0 95px;
  width: 95px;
  text-align: center;
  background: #ff9702;
  color: #fff;
  font-size: 15px;
}

.flex-bottom span {
  color: #ff9702;
}
</style>