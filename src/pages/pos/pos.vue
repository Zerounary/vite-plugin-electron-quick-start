<template>
  <div class="px-3 space-y-3 text-13px">
    <div class="box space-x-3 w-full flex items-center bg-white shadow rounded">
      <input placeholder="请输入会员卡号或者手机号" v-model="vipKeyWord" />
      <button class="btn" @click="queryVip">查询</button>
      <button class="btn" @click="openVipDialog">新增VIP</button>
      <div class="circle !ml-24"></div>
      <div>{{ mobil }}</div>
      <div>白金卡</div>
      <div>券：{{ tickets }}</div>
      <div>积分：{{ integral }}</div>
      <div>储值：{{ amount }}</div>
    </div>
    <div
      class="flex space-x-3 h-[calc(100vh-60px-0.75rem-80px-0.75rem-0.75rem)]"
    >
      <div
        class="flex-grow h-full flex flex-col divide-y bg-white rounded shadow"
      >
        <div class="flex-grow w-full p-5">
          <table class="w-full">
            <thead class="text-gray-600">
              <tr>
                <th>款号</th>
                <th>品名</th>
                <th>销售属性</th>
                <th>数量</th>
                <th>原价</th>
                <th>成交价</th>
                <th>折扣</th>
                <th>成交金额</th>
                <th>库存</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="h-[calc(100vh-350px)] overflow-auto divide-y">
              <tr v-for="n in 100" :key="n">
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box space-x-3">
          <input :value="productKeyWord" @input="toUpper" placeholder="请输入条码" />
          <button @click="queryProduct" class="btn">查询</button>
        </div>
      </div>
      <div
        class="h-full overflow-auto flex flex-col bg-white rounded shadow space-y-3 px-5"
      >
        <div class="grid grid-cols-3 gap-3 mt-10">
          <div
            class="flex flex-col items-center space-y-2"
            @click="openEmployeeDialog"
          >
            <div class="square"></div>
            <div>营业员</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>库存查询</div>
          </div>
          <div class="flex flex-col items-center space-y-2" @click="newRetail" >
            <div class="square"></div>
            <div>开新单</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>原单退货</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>非原单退货</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>订单查询</div>
          </div>
          <div class="flex flex-col items-center space-y-2">
            <div class="square"></div>
            <div>挂单</div>
          </div>
        </div>
        <!-- 备注 -->
        <div class="!mt-10">
          <input class="!h-40px" placeholder="请输入备注" />
        </div>

        <div class="space-y-10 !mt-10 flex-grow">
          <div class="flex items-center">
            <div class="flex-grow text-16px">优惠券</div>
            <div class="w-120px text-right">
              <select>
                <option>优惠券XXXXXX</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">积分</div>
            <div class="w-240px text-right">
              共1000积分，使用50积分，抵扣50.00元
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">抹零</div>
            <div class="w-240px text-right">
              已优惠9元
              <select>
                <option>保留小数位</option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-center text-16px space-x-16 !mt-20"
        >
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">2900.00</div>
            <div class="text-gray-500">商品总价</div>
          </div>
        </div>

        <div class="!mt-10 flex items-center space-x-5 py-5">
          <div class="flex-grow text-right space-y-2">
            <div>共5件商品</div>
            <div class="text-red-500">￥2400.00</div>
          </div>

          <button class="h-50px w-120px border rounded bg-blue-500 text-white">
            付款
          </button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    class="no-drag"
    width="300px"
    v-model="employeeDialogVisible"
    title="选择营业员"
  >
    <el-radio-group
      class="h-200px overflow-auto"
      v-model="retailStore.retailForm.SalesrepId"
    >
      <el-radio
        class="w-full"
        v-for="item in employeeStore.employee"
        :key="item.id"
        :label="item.id"
        >{{ item.name }}</el-radio
      >
    </el-radio-group>
    <el-button type="primary" @click="closeEmployeeDialog">保存</el-button>
    <el-button @click="cancelEmployee">取消</el-button>
  </el-dialog>
  <el-dialog class="no-drag" v-model="vipDialogVisible" title="新增会员">
    <el-form
      :model="vipForm"
      :rules="vipRules"
      ref="vipFormInstance"
      label-width="80px"
      ><el-form-item label="会员卡号" prop="cardno">
        <el-input
          v-model="vipForm.cardno"
          placeholder="请输入会员卡号"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobil">
        <el-input
          v-model="vipForm.mobil"
          placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="顾客姓名" prop="vipname">
        <el-input v-model="vipForm.vipname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          class="w-full"
          v-model="vipForm.birthday"
          value-format="YYYYMMDD"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="vipForm.sex">
          <el-radio label="m">男</el-radio>
          <el-radio label="f">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开卡人" prop="name">
        <el-select v-model="vipForm.HrEmployeeId" filterable>
          <el-option
            v-for="item in employeeStore.employee"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="name">
        <el-input v-model="vipForm.description"></el-input>
      </el-form-item>
      <el-form-item label="VIP类型" prop="CViptypeId">
        <el-radio-group v-model="vipForm.CViptypeId">
          <template v-for="vipType in vipStore.vipTypes" :key="vipType">
            <el-radio :label="vipType.id">{{ vipType.name }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveVip">保存</el-button>
        <el-button @click="closeVipDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, Ref } from "vue";
import { useVipStore } from "@/stores/vip";
import { useEmployeeStore } from "@/stores/employee";
import { useRetailStore } from "@/stores/retail";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/product";
import { ElMessage } from "element-plus";

const vipStore = useVipStore();
const employeeStore = useEmployeeStore();
const retailStore = useRetailStore();
const productStore = useProductStore();

const vipDialogVisible = ref(false);
const vipFormInstance = ref();

const { vipForm } = storeToRefs(vipStore);

const vipRules = ref({});

const fetchData = async () => {
  await vipStore.fetchAllVipType();
  await employeeStore.fetchAllEmployee();
}

const openVipDialog = () => {
  vipStore.resetVipForm();
  vipDialogVisible.value = true;
};

const closeVipDialog = () => {
  vipDialogVisible.value = false;
};

// 营业员弹窗
const employeeDialogVisible = ref(false);

const openEmployeeDialog = () => {
  employeeDialogVisible.value = true;
};

const closeEmployeeDialog = () => {
  employeeDialogVisible.value = false;
};

const cancelEmployee = () => {
  retailStore.retailForm.SalesrepId = null;
  closeEmployeeDialog();
}

onMounted(async () => {
  await fetchData();
});

const saveVip = async () => {
  vipStore.save(vipForm.value).then((result) => {
    closeVipDialog();
  });
};

// 手机号
const mobil = computed(() => {
  return vipStore.vip?.mobil || "-";
});

// 会员类型
const vipType = computed(() => {
  return vipStore.vip?.vipType || "无";
});

// 积分
const integral = computed(() => {
  return vipStore.vip?.integral || 0;
});

// 储值
const amount = computed(() => {
  return vipStore.vip?.amount || 0;
});

// 优惠券
const tickets = computed(() => {
  return vipStore.vip?.tickets || 0;
});
let vipKeyWord = ref("");
let productKeyWord = ref("HW21002");

let queryVip = async () => {
  await vipStore.fetchVip(vipKeyWord.value);
  vipKeyWord.value = "";
};

let queryProduct = async () => {
  let res = await productStore.fetchProductKeyWord(productKeyWord.value);
  if(!res){
    ElMessage.warning("没有查询到相关商品");
  }else{
    // 创建零售单
    retailStore.createRetail(res);
    if(res.type == "spu"){
      // 款号展示矩阵
    }else {
      // 条码直接录入
    }
  }
  console.log("🚀 ~ file: pos.vue ~ line 333 ~ queryProduct ~ res", res)
};

let newRetail = async () => {
  fetchData();
  vipStore.$reset();
  retailStore.$reset();
}

let toUpper = (e) => {
  productKeyWord.value = e.target.value.toUpperCase();
}
</script>

<style scoped>
table thead,
table tbody {
  @apply w-full float-left;
}
table tr {
  @apply h-40px w-full table text-left;
}
table th,
table td {
  width: 10%;
}
.box {
  @apply h-80px px-5 py-5;
}

input {
  @apply border h-full rounded px-2 w-240px;
}
.btn {
  @apply w-80px border px-2 h-full rounded text-sm;
}
.circle {
  @apply w-8 h-8 rounded-full bg-gray-200;
}
.square {
  @apply w-80px h-80px rounded bg-gray-200;
}
</style>
