<script setup>
import {createOrderAPI, getCheckInfoAPI} from '@/apis/checkout'
import {ElMessage} from "element-plus";
import {addAddressAPI, delAddressAPI, updateAddressAPI} from "@/apis/addresses.js";
import { onMounted, ref } from 'vue'
import router from "@/router/index.js";
import {useCartStore} from "@/stores/cartStore.js";

// 获取结算信息
const checkInfo = ref({}) // 订单对象
const curAddress = ref({}) // 默认地址
const updateAddress =ref({})// 更新数据获取
const cartStore = useCartStore();
// 收货地址

const getCheckInfo = async () => {
  const res = await getCheckInfoAPI()
  checkInfo.value = res.result
  const i = checkInfo.value.goods
  console.log(JSON.stringify(i));
  // 适配默认地址
  // 从地址列表中筛选出来 isDefault === 0 那一项
  const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0)

  curAddress.value = item
}

onMounted(() => getCheckInfo())
// 收货地址切换
const showDialog = ref(false)
const showUpdate = ref(false)
const showRegister = ref(false)
// 收货地址的获取
const activeAddress = ref({})
const switchAddress = (item) => {
  activeAddress.value = item
}
// 关闭Dialog页面
const offDialog = () => {
  showDialog.value = false;
  showUpdate.value = false;
  showRegister.value = false;
}

// 打开UpdateDialog页面
const openUpdate = async (item) => {
  showDialog.value = false;
  updateAddress.value = item;
  updateform.value = item;
  showUpdate.value = true;
}

// 打开RegisterDialog页面
const openRegister = () => {
  showRegister.value = true;
}

// 删除Address
const delAddress = async (id) => {
  delAddressAPI(id);
  const res = await getCheckInfoAPI();
  checkInfo.value = res.result;
}

// 创建订单
const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    goods: checkInfo.value.goods.map(item => {
      return {
        skuId: item.skuId,
        count: item.count
      }
    }),
    addressId: curAddress.value.id
  })
  const orderId = res.result.id
  console.log(orderId)
  router.push({
    path: '/pay',
    query: {
      id: orderId
    }
  })
}

// 确认切换地址
const confirm = () => {
  curAddress.value = activeAddress.value;
  showDialog.value = false;
}

// 1. 准备表单对象
const form = ref({
  receiver: '老李',
  contact: '13489892323',
  provinceCode: '430000',
  cityCode: '431000',
  countyCode: '431028',
  address: '竹山乡 松岗村',
  postalCode: '111006',
  addressTags: '家里',
  isDefault: 1,
  fullLocation: '湖南省 郴州市 安仁县'
})

// 2. 准备更新表单对象
const updateform = ref({
  receiver: '',
  contact: '',
  provinceCode: '210000',
  cityCode: '210200',
  countyCode: '210202',
  address: '',
  postalCode: '111006',
  addressTags: '家里',
  isDefault: 1,
  fullLocation: ''
})

// 规则数据对象
const rules = {
  receiver: [
    {required: true, message: '收货人不能为空',trigger: 'blur'}
  ],
  contact: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 11, max: 11, message: '标准电话格式11number',trigger: 'blur'}
  ],
  provinceCode: [
    {required: true, message: '省份编码不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前2位加4个0',trigger: 'blur'}
  ],
  cityCode: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前4位加2个0',trigger: 'blur'}
  ],
  countyCode: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前6位',trigger: 'blur'}
  ],
  fullLocation: [
    {required: true, message: '省市信息不能为空',trigger: 'blur'},
    {min: 5, max: 20, message: '格式: 湖南省 长沙市 芙蓉区',trigger: 'blur'}
  ],
  address: [
    {required: true, message: '详细地址不能为空',trigger: 'blur'},
    {min: 5, max: 20, message: '格式: 长沙县 盼盼路 普德泵业',trigger: 'blur'}
  ]
}

// 规则数据对象
const updateRules = {
  receiver: [
    {required: true, message: '收货人不能为空',trigger: 'blur'}
  ],
  contact: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 11, max: 11, message: '标准电话格式11number',trigger: 'blur'}
  ],
  provinceCode: [
    {required: true, message: '省份编码不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前2位加4个0',trigger: 'blur'}
  ],
  cityCode: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前4位加2个0',trigger: 'blur'}
  ],
  countyCode: [
    {required: true, message: '联系方式不能为空',trigger: 'blur'},
    {min: 6, max: 6, message: '身份证前6位',trigger: 'blur'}
  ],
  fullLocation: [
    {required: true, message: '省市信息不能为空',trigger: 'blur'},
    {min: 5, max: 20, message: '格式: 湖南省 长沙市 芙蓉区',trigger: 'blur'}
  ],
  address: [
    {required: true, message: '详细地址不能为空',trigger: 'blur'},
    {min: 5, max: 20, message: '格式: 长沙县 盼盼路 普德泵业',trigger: 'blur'}
  ]
}

// form实例统一校验
const formRef = ref(null);

// form实例统一校验
const updateFormRef = ref(null);

const addAddress = ()=>{
  formRef.value.validate(async (valid)=>{
    // console.log(valid);
    if (valid) {
      const data = form.value;
      console.log(data);
      await addAddressAPI(data);
      ElMessage({type: 'success', message: '添加成功'});
      const res = await getCheckInfoAPI();
      checkInfo.value = res.result;
      showRegister.value = false;
      showDialog.value = true;

    }
  });
}

const AddressUpdate = (id)=>{
  updateFormRef.value.validate(async (valid)=>{
    // console.log(valid);
    if (valid) {
      const data = updateform.value;
      await updateAddressAPI(id,data);
      ElMessage({type: 'success', message: '修改成功'});
      const res = await getCheckInfoAPI();
      checkInfo.value = res.result;
      showUpdate.value = false;
      showDialog.value = true;
    }
  });
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialog = true">切换地址</el-button>
              <el-button size="large" @click="openRegister">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
            <tr>
              <th width="520">商品信息</th>
              <th width="170">单价</th>
              <th width="170">数量</th>
              <th width="170">小计</th>
              <th width="170">实付</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in checkInfo.goods" :key="i.id">
              <td>
                <a href="javascript:;" class="info">
                  <img :src="i.picture" alt="">
                  <div class="right">
                    <p>{{ i.name }}</p>
                    <p>{{ i.attrsText }}</p>
                  </div>
                </a>
              </td>
              <td>&yen;{{ i.price }}</td>
              <td>{{ i.count }}</td>
              <td>&yen;{{ i.totalPrice }}</td>
              <td>&yen;{{ i.totalPayPrice }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
    <div class="addressWrapper">
      <div class="text item" v-for="item in checkInfo.userAddresses" :class="{ active: activeAddress.id === item.id }"
           @click="switchAddress(item)" :key="item.id">
        <ul class="top_ul">
          <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</li>
        </ul>
        <ul>
          <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="delAddress(item.id)">
            <template #reference>
              <el-button class="delete">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button class="update" @click="openUpdate(item)">修改</el-button>
        </ul>
      </div>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="offDialog">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
    </template>
  </el-dialog>
  <!-- 修改页面-->
  <el-dialog v-model="showUpdate" title="修改收货地址" width="30%" center>
    <div class="addressUpdate">
      <br>
      <el-form :model="updateform" ref="updateFormRef" :rules="updateRules" label-position="right" label-width="60px" status-icon>
        <el-form-item label-width="80px" label="收货人" prop="receiver">
          <el-input v-model="updateform.receiver" />
        </el-form-item>
        <el-form-item label-width="80px" label="联系方式" prop="contact">
          <el-input v-model="updateform.contact" />
        </el-form-item>
        <el-form-item label-width="80px" label="省份编码" prop="provinceCode">
          <el-input v-model="updateform.provinceCode" />
        </el-form-item>
        <el-form-item label-width="80px" label="城市编码" prop="cityCode">
          <el-input v-model="updateform.cityCode" />
        </el-form-item>
        <el-form-item label-width="80px" label="地区编码" prop="countyCode">
          <el-input v-model="updateform.countyCode" />
        </el-form-item>
        <el-form-item label-width="80px" label="省市位置" prop="fullLocation">
          <el-input v-model="updateform.fullLocation" />
        </el-form-item>
        <el-form-item label-width="80px" label="详细地址" prop="address">
          <el-input v-model="updateform.address" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="offDialog">取消</el-button>
      <el-button type="primary" @click="AddressUpdate(updateAddress.id)">修改</el-button>
    </span>
    </template>
  </el-dialog>
  <!-- 添加地址 -->
  <el-dialog v-model="showRegister" title="添加收货地址" width="30%" center>
    <div class="addressRegister">
      <div>
        <br>
        <el-form :model="form" ref="formRef" :rules="rules" label-position="right" label-width="60px" status-icon>
          <el-form-item label-width="80px" label="收货人" prop="receiver">
            <el-input v-model="form.receiver" />
          </el-form-item>
          <el-form-item label-width="80px" label="联系方式" prop="contact">
            <el-input v-model="form.contact" />
          </el-form-item>
          <el-form-item label-width="80px" label="省份编码" prop="provinceCode">
            <el-input v-model="form.provinceCode" />
          </el-form-item>
          <el-form-item label-width="80px" label="城市编码" prop="cityCode">
            <el-input v-model="form.cityCode" />
          </el-form-item>
          <el-form-item label-width="80px" label="地区编码" prop="countyCode">
            <el-input v-model="form.countyCode" />
          </el-form-item>
          <el-form-item label-width="80px" label="省市位置" prop="fullLocation">
            <el-input v-model="form.fullLocation" />
          </el-form-item>
          <el-form-item label-width="80px" label="详细地址" prop="address">
            <el-input v-model="form.address" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="offDialog">取消</el-button>
      <el-button type="primary" @click="addAddress">添加</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }


  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
  .top_ul{
    width: 600px;
    height: 100px;
  }
  .delete{
    border: none;
    background: none;
    color: #1dc779;
  }
  .update{
    padding-left: 2px;
    border: none;
    background: none;
    color: #1dc779;
  }

}
</style>