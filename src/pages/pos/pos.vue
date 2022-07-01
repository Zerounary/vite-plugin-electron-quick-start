<template>
  <div class="px-3 space-y-3 text-13px">
    <div
      id="vip"
      class="box space-x-3 w-full flex items-center bg-white shadow rounded"
    >
      <input placeholder="请输入会员卡号或者手机号" v-model="vipKeyWord" />
      <button class="btn" @click="queryVip">查询</button>
      <button class="btn" @click="openVipDialog">新增VIP</button>
      <div class="circle !ml-24"></div>
      <div>{{ mobil }}</div>
      <div>白金卡</div>
      <div>券：{{ tickets }}</div>
      <div>积分：{{ integral }}</div>
      <div>储值：{{ amount }}</div>
      <div class="flex-grow text-right text-base font-bold text-gray-600">
        本机单号：{{ retailStore.localBillCount || "空" }}
      </div>
    </div>
    <div
      class="flex space-x-3 h-[calc(100vh-60px-0.75rem-80px-0.75rem-0.75rem)]"
    >
      <div
        class="flex-grow h-full flex flex-col divide-y bg-white rounded shadow"
        v-loading="retailStore.marketing"
      >
        <div id="content" class="flex-grow w-full overflow-auto p-5">
          <table class="headfix w-full">
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
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="h-[calc(100vh-350px)] overflow-auto divide-y">
              <tr v-for="(item, index) in retailStore.pos.items" :key="item.id">
                <td class="space-y-3">
                  <div class="headline">{{ item.good.spuName }}</div>
                  <div class="">
                    <el-tag
                      type="danger"
                      v-for="activity in retailStore.getItemActivity(index)"
                      :key="activity.activityName"
                      :title="`减 ${activity.activityDisAmount} 元`"
                      >{{ activity.activityName }}</el-tag
                    >
                  </div>
                </td>
                <td>
                  <div class="headline">{{ item.good.spuCode }}</div>
                </td>
                <td class="text-xs">
                  <div class="headline space-x-2">
                    <el-tag type="success" title="颜色"
                      >{{
                        productStore.getSkuFull(item.good.skuCode).colorName
                      }}
                    </el-tag>
                    <el-tag type="success" title="尺码"
                      >{{ productStore.getSkuFull(item.good.skuCode).sizeName }}
                    </el-tag>
                  </div>
                </td>
                <td>
                  <input
                    :value="item.qty"
                    @input="
                      retailStore.changeRowItemField(
                        index,
                        'qty',
                        $event.target.value
                      )
                    "
                  />
                </td>
                <td>
                  <div class="headline">{{ item.price }}</div>
                </td>
                <td>
                  <input
                    :value="item.actPrice"
                    @input="
                      retailStore.changeRowItemField(
                        index,
                        'actPrice',
                        $event.target.value
                      )
                    "
                  />
                </td>
                <td>
                  <div class="headline">{{ item.discount }}</div>
                </td>
                <td>
                  <div class="headline">{{ item.actAmount }}</div>
                </td>
                <td
                  class="text-red-500 cursor-pointer"
                  @click="deleteItem(index)"
                >
                  <div class="headline">删除</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="pdt-input" class="box space-x-3 relative">
          <div
            class="absolute bottom-90px w-500px shadow border rounded p-30px"
            v-show="pdtOptionsVisible"
          >
            <el-table
              :show-header="false"
              :data="pdtOptions"
              max-height="250"
              @row-click="selectPdt"
            >
              <el-table-column prop="code" />
              <el-table-column prop="name" />
              <el-table-column
                prop="type"
                :formatter="
                  (row, column, cellValue, index) => {
                    return cellValue == 'spu' ? '款号' : '条码';
                  }
                "
              />
            </el-table>
          </div>
          <input
            :value="productKeyWord"
            @input="toUpper"
            @keydown.enter="queryAndPutItem"
            placeholder="请输入条码"
          />
          <button @click="queryAndPutItem" class="btn">查询</button>
          <div
            class="inline-block"
            v-if="retailStore.type == RetailType.RET"
            @click="taggleRetailMode"
          >
            <div
              title="零售退货"
              class="cursor-pointer select-none text-red-500 text-xl font-bold border border-4px w-40px h-40px flex items-center justify-center rounded-full border-red-500"
            >
              退
            </div>
          </div>
          <div
            class="inline-block"
            v-if="retailStore.type == RetailType.SALE"
            @click="taggleRetailMode"
          >
            <div
              title="正常零售"
              class="cursor-pointer select-none text-blue-500 text-xl font-bold border border-4px w-40px h-40px flex items-center justify-center rounded-full border-blue-500"
            >
              销
            </div>
          </div>
        </div>
      </div>
      <div
        id="left-side"
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
          <div class="flex flex-col items-center space-y-2" @click="newRetail">
            <div class="square"></div>
            <div>开新单</div>
          </div>
          <div
            class="flex flex-col items-center space-y-2"
            @click="originRetVisable = true"
          >
            <div class="square"></div>
            <div>原单退货</div>
          </div>
          <div
            class="flex flex-col items-center space-y-2"
            @click="setRetRetailMode"
          >
            <div class="square"></div>
            <div>非原单退货</div>
          </div>
          <div
            class="flex flex-col items-center space-y-2"
            @click="openRetailQueryDialog"
          >
            <div class="square"></div>
            <div>订单查询</div>
          </div>
          <div class="flex flex-col items-center space-y-2" @click="hangRetail">
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
                <option v-if="retailStore.pos.ticketItems">无</option>
                <option
                  v-for="ticket in retailStore.pos.ticketItems"
                  :key="ticket.ticketNo"
                >
                  {{ ticket.ticketName }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">积分</div>
            <div class="w-240px text-right">
              共{{ integral }}积分，使用0积分，抵扣0.00元
            </div>
          </div>

          <div class="flex items-center">
            <div class="flex-grow text-16px">抹零</div>
            <div class="w-240px text-right">
              已优惠0元
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
            <div class="font-bold">{{ retailStore.pos.totAmount }}</div>
            <div class="text-gray-500">商品总价</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">{{ retailStore.pos.totDisAmount }}</div>
            <div class="text-gray-500">优惠金额</div>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="font-bold">{{ retailStore.pos.totQty }}</div>
            <div class="text-gray-500">商品总数</div>
          </div>
        </div>

        <div class="!mt-10 flex items-center space-x-5 py-5">
          <div class="flex-grow text-right space-y-2">
            <div>共5件商品</div>
            <div class="text-red-500 text-xl">
              ￥{{ retailStore.pos.totActAmount }}
            </div>
          </div>

          <button
            class="h-50px w-120px border rounded bg-blue-500 text-white"
            @click="payDialogVisible = true"
          >
            付款
          </button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    id="d-pdt"
    class="no-drag"
    title="商品输入"
    v-model="matrixDialogVisible"
  >
    <div class="space-y-5">
      <div class="flex space-x-10">
        <div>
          款号：
          {{ spuMatrix.product.value }}
        </div>
        <div>
          品名：
          {{ spuMatrix.product.value }}
        </div>
        <div>
          零售价：
          {{ spuMatrix.product.pricelist }}
        </div>
        <div>
          <img :src="spuMatrix.product.imageUrl" />
        </div>
      </div>
      <div>
        <table id="matrix" class="w-full">
          <thead>
            <tr>
              <th>颜色\尺码</th>
              <th v-for="size in sizes" :key="size.id">
                {{ size.name }}({{ size.code }})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="h-80px" v-for="color in colors" :key="color.id">
              <td>{{ color.name }}</td>
              <td v-for="size in sizes" :key="size.id">
                <div>
                  <div>
                    <input
                      :value="getMatrixValue(color.id, size.id)"
                      @input="matrixChange(color.id, size.id, $event)"
                      class="p-10px w-full"
                    />
                  </div>
                  <!-- <div>可用：{{ getSpuStorage(color.id, size.id) }}</div> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end space-x-5">
          <el-button type="primary" @click="saveMatrixValue">保存</el-button>
          <el-button @click="closeMatrixDialog">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    id="d-emp"
    class="no-drag"
    width="300px"
    v-model="employeeDialogVisible"
    title="选择营业员"
  >
    <el-radio-group
      class="h-200px overflow-auto"
      v-model="retailStore.pos.salesrepId"
    >
      <el-radio
        class="w-full"
        v-for="item in employeeStore.employee"
        :key="item.id"
        :label="item.id"
        >{{ item.name }}</el-radio
      >
    </el-radio-group>
    <el-button type="primary" @click="employeeDialogSave">保存</el-button>
    <el-button @click="cancelEmployee">取消</el-button>
  </el-dialog>
  <el-dialog
    id="d-vip"
    class="no-drag"
    v-model="vipDialogVisible"
    title="新增会员"
  >
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
  <el-dialog
    id="d-payment"
    custom-class="no-drag"
    width="600px"
    v-model="payDialogVisible"
    title="付款"
  >
    <div class="space-y-5">
      <div
        class="border rounded h-80px grid grid-cols-4 items-center text-16px"
      >
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl">{{ retailStore.pos.totQty }}</div>
          <div class="text-gray-500">总数量</div>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl text-yellow-500">
            {{ retailStore.pos.totActAmount }}
          </div>
          <div class="text-gray-500">总计</div>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl text-indigo-600">
            {{ retailStore.totPayAmt }}
          </div>
          <div class="text-gray-500">收款</div>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl text-red-500">
            {{ retailStore.changeAmt }}
          </div>
          <div class="text-gray-500">找零</div>
        </div>
      </div>
      <div class="flex flex-col space-y-2 items-center justify-center">
        <div
          class="grid grid-cols-5 gap-1 items-center"
          v-for="(payment, index) in retailStore.payments"
          :key="payment.id"
        >
          <div class="w-80px">{{ payment.name }}</div>
          <div class="col-span-3">
            <input class="py-3 px-2 w-120px" v-model.number="payment.payAmt" />
          </div>
          <div v-if="index > 0">
            <Icon
              class="cursor-pointer"
              @click="removePayment(index)"
              icon="material-symbols:close-rounded"
            />
          </div>
          <div v-else></div>
        </div>
      </div>
      <div class="flex space-x-5 w-max-600px overflow-x-auto">
        <div
          class="flex items-center justify-center flex-shrink-0 h-24 w-24 rounded border"
          v-for="payway in paywayStore.payways"
          :key="payway.id"
          @click="appendPayment(payway)"
        >
          <div>{{ payway.name }}</div>
        </div>
      </div>
    </div>
    <div class="pt-5 text-right">
      <el-button size="large" type="info" @click="rePay">重付</el-button>
      <el-button size="large" type="primary" @click="savePay">付款</el-button>
      <el-button size="large" @click="closePayDialog">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog
    id="d-origin-ret"
    custom-class="no-drag"
    width="1200px"
    v-model="originRetVisable"
    title="原单退货"
  >
    <div class="space-y-5">
      <el-form :inline="true">
        <el-form-item label="销售店铺：">
          {{ storeStore.name }}
        </el-form-item>
        <el-form-item label="小票编号：">
          <el-input v-model="retailStore.retailFilter.refno" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="retailStore.retailFilter.phone" />
        </el-form-item>
        <el-form-item label="营业员：">
          <el-select clearable v-model="retailStore.retailFilter.employeeId">
            <el-option
              v-for="item in employeeStore.employee"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="销售日期：">
          <el-date-picker
            type="daterange"
            value-format="YYYYMMDD"
            v-model="retailStore.retailFilter.billdate"
          >
          </el-date-picker>
          <!-- <el-radio-group>
            <el-radio-button>不限</el-radio-button>
            <el-radio-button>今天</el-radio-button>
            <el-radio-button>昨天</el-radio-button>
            <el-radio-button>本周</el-radio-button>
            <el-radio-button>上周</el-radio-button>
            <el-radio-button>本月</el-radio-button>
            <el-radio-button>指定日期</el-radio-button>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="retailStore.queryRetailList()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        height="300"
        stripe
        border
        highlight-current-row
        :data="retailStore.retailList"
        @row-click="rowClick"
      >
        <el-table-column
          prop="billdate"
          label="销售日期"
          width=""
        ></el-table-column>
        <el-table-column
          prop="docno"
          label="小票编号"
          width=""
        ></el-table-column>
        <el-table-column
          prop="employee"
          label="营业员"
          width=""
        ></el-table-column>
        <el-table-column prop="vip" label="VIP" width=""></el-table-column>
        <el-table-column prop="totQty" label="数量" width=""></el-table-column>
        <el-table-column prop="totRQty" label="已退" width=""></el-table-column>
        <el-table-column
          prop="actAmount"
          label="成交金额"
          width=""
        ></el-table-column>
        <el-table-column
          prop="storeName"
          label="店仓"
          width=""
        ></el-table-column>
      </el-table>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-table
            height="200"
            stripe
            border
            :data="retailStore.retailItemList"
          >
            <el-table-column
              prop="spuCode"
              label="款号"
              width=""
            ></el-table-column>
            <el-table-column
              prop="spuName"
              label="品名"
              width=""
            ></el-table-column>
            <el-table-column
              prop="skuCode"
              label="条码"
              width=""
            ></el-table-column>
            <el-table-column
              prop="colorName"
              label="颜色"
              width=""
            ></el-table-column>
            <el-table-column
              prop="sizeName"
              label="尺码"
              width=""
            ></el-table-column>
            <el-table-column prop="qty" label="数量" width=""></el-table-column>
            <el-table-column
              prop="rqty"
              label="已退"
              width=""
            ></el-table-column>
            <el-table-column prop="retQty" label="本次退货" width="">
              <template #default="scope">
                <el-input
                  :disabled="scope.row.qty <= scope.row.rqty"
                  v-model.number="scope.row.retQty"
                  @change="retItemQty(scope.row, $event)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="priceActual"
              label="成交价"
              width=""
            ></el-table-column>
            <el-table-column
              prop="actAmount"
              label="成交金额"
              width=""
            ></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <el-card title="付款方式">
            <ul class="space-y-3">
              <li class="flex items-center">
                <div class="payment-label">付款方式</div>
                <div class="text-xl">
                  {{ retailStore.originRetailPayment.payway }}
                </div>
              </li>
              <li class="flex items-center">
                <div class="payment-label">付款金额</div>
                <div class="text-xl">
                  {{ retailStore.originRetailPayment.payAmt }}
                </div>
              </li>
              <li class="flex items-center">
                <div class="payment-label">可退金额</div>
                <div class="text-xl">
                  {{ retailStore.originRetailPayment.canRetAmt }}
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="pt-5 text-right">
      <el-button size="large" type="primary" @click="openRetPayDialog"
        >确定</el-button
      >
      <el-button size="large" @click="originRetVisable = false">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog
    id="d-origin-ret-pay"
    custom-class="no-drag"
    width="600px"
    v-model="retPayDialogVisible"
    title="退款"
  >
    <div class="space-y-5">
      <div
        class="border rounded h-80px grid grid-cols-3 items-center text-16px"
      >
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl">{{ retailStore.retTotalQty }}</div>
          <div class="text-gray-500">总数量</div>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl text-yellow-500">
            {{ retailStore.retTotalAmount }}
          </div>
          <div class="text-gray-500">应退款</div>
        </div>
        <div class="flex flex-col items-center space-y-1">
          <div class="font-bold text-3xl text-indigo-600">
            {{ retailStore.totPayAmt }}
          </div>
          <div class="text-gray-500">实际退款</div>
        </div>
      </div>
      <div class="flex flex-col space-y-2 items-center justify-center">
        <div
          class="grid grid-cols-5 gap-1 items-center"
          v-for="(payment, index) in retailStore.payments"
          :key="payment.id"
        >
          <div class="w-80px">{{ payment.name }}</div>
          <div class="col-span-3">
            <input class="py-3 px-2 w-120px" v-model.number="payment.payAmt" />
          </div>
          <div v-if="index > 0">
            <Icon
              class="cursor-pointer"
              @click="removePayment(index)"
              icon="material-symbols:close-rounded"
            />
          </div>
          <div v-else></div>
        </div>
      </div>
      <div class="flex space-x-5 w-max-600px overflow-x-auto">
        <div
          class="flex items-center justify-center flex-shrink-0 h-24 w-24 rounded border"
          v-for="payway in paywayStore.payways"
          :key="payway.id"
          @click="appendPayment(payway)"
        >
          <div>{{ payway.name }}</div>
        </div>
      </div>
    </div>
    <div class="pt-5 text-right">
      <el-button size="large" type="info" @click="reRetPay">重付</el-button>
      <el-button size="large" type="primary" @click="submitOriginRetRetail"
        >确定</el-button
      >
      <el-button size="large" @click="closeRetPayDialog">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog
    id="d-retail-query"
    custom-class="no-drag"
    width="1200px"
    v-model="retailQueryVisable"
    title="订单查询"
  >
    <el-tabs>
      <el-tab-pane label="远程单据">
        <div class="space-y-5">
          <el-form :inline="true">
            <el-form-item label="销售店铺：">
              {{ storeStore.name }}
            </el-form-item>
            <el-form-item label="小票编号：">
              <el-input v-model="retailStore.retailFilter.refno" />
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="retailStore.retailFilter.phone" />
            </el-form-item>
            <el-form-item label="营业员：">
              <el-select
                clearable
                v-model="retailStore.retailFilter.employeeId"
              >
                <el-option
                  v-for="item in employeeStore.employee"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  >{{ item.name }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="销售日期：">
              <el-date-picker
                type="daterange"
                value-format="YYYYMMDD"
                v-model="retailStore.retailFilter.billdate"
              >
              </el-date-picker>
              <!-- <el-radio-group>
            <el-radio-button>不限</el-radio-button>
            <el-radio-button>今天</el-radio-button>
            <el-radio-button>昨天</el-radio-button>
            <el-radio-button>本周</el-radio-button>
            <el-radio-button>上周</el-radio-button>
            <el-radio-button>本月</el-radio-button>
            <el-radio-button>指定日期</el-radio-button>
          </el-radio-group> -->
            </el-form-item>
            <el-form-item label="提交状态：">
              <el-select clearable v-model="retailStore.retailFilter.status">
                <el-option label="未提交" value="1"></el-option>
                <el-option label="已提交" value="2"></el-option>
                <el-option label="待批" value="3"></el-option>
                <el-option label="待取消" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="retailStore.queryRetailList()"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            height="300"
            stripe
            border
            highlight-current-row
            :data="retailStore.retailList"
            @row-click="rowClick"
          >
            <el-table-column
              prop="billdate"
              label="销售日期"
              width=""
            ></el-table-column>
            <el-table-column
              prop="docno"
              label="小票编号"
              width=""
            ></el-table-column>
            <el-table-column
              prop="employee"
              label="营业员"
              width=""
            ></el-table-column>
            <el-table-column prop="vip" label="VIP" width=""></el-table-column>
            <el-table-column
              prop="totQty"
              label="数量"
              width=""
            ></el-table-column>
            <el-table-column
              prop="actAmount"
              label="成交金额"
              width=""
            ></el-table-column>
            <el-table-column
              prop="storeName"
              label="店仓"
              width=""
            ></el-table-column>
          </el-table>
          <el-row :gutter="10">
            <el-col :span="18">
              <el-table
                height="200"
                stripe
                border
                :data="retailStore.retailItemList"
              >
                <el-table-column
                  prop="spuCode"
                  label="款号"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="spuName"
                  label="品名"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="skuCode"
                  label="条码"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="colorName"
                  label="颜色"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="sizeName"
                  label="尺码"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="qty"
                  label="数量"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="priceActual"
                  label="成交价"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="actAmount"
                  label="成交金额"
                  width=""
                ></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="6">
              <el-card title="付款方式">
                <ul class="space-y-3">
                  <li class="flex items-center">
                    <div class="payment-label">付款方式</div>
                    <div class="text-xl">
                      {{ retailStore.originRetailPayment.payway }}
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="payment-label">付款金额</div>
                    <div class="text-xl">
                      {{ retailStore.originRetailPayment.payAmt }}
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="payment-label">可退金额</div>
                    <div class="text-xl">
                      {{ retailStore.originRetailPayment.canRetAmt }}
                    </div>
                  </li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="离线单据">
        <div class="space-y-5">
          <el-form :inline="true">
            <el-form-item label="挂单状态：">
              <el-select clearable v-model="isHang">
                <el-option label="未挂单" value="0"></el-option>
                <el-option label="已挂单" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款状态：">
              <el-select clearable v-model="isPay">
                <el-option label="未付款" value="0"></el-option>
                <el-option label="已付款" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推送状态：">
              <el-select clearable v-model="isPush">
                <el-option label="未推送" value="0"></el-option>
                <el-option label="已推送" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryDBRetail">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table stripe border height="300" highlight-current-row :data="dbRetailList" @row-click="offlineRowClick">
            <el-table-column prop="docno" label="小票号"></el-table-column>
            <el-table-column prop="billdate" label="单据日期"></el-table-column>
            <el-table-column prop="vip.mobil" label="会员"></el-table-column>
            <el-table-column
              prop="employee.name"
              label="营业员"
            ></el-table-column>
            <el-table-column prop="totQty" label="总数量"></el-table-column>
            <el-table-column
              prop="totAmount"
              label="总零售额"
            ></el-table-column>
            <el-table-column
              prop="totActAmount"
              label="总成交额"
            ></el-table-column>
            <el-table-column
              prop="totDisAmount"
              label="总折扣额"
            ></el-table-column>
          </el-table>
          <el-row :gutter="10">
            <el-col :span="18">
              <el-table
                height="200"
                stripe
                border
                :data="retailStore.currentOfflineRetail.items"
              >
                <el-table-column
                  prop="good.spuCode"
                  label="款号"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="good.spuName"
                  label="品名"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="good.skuCode"
                  label="条码"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="qty"
                  label="数量"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="actPrice"
                  label="成交价"
                  width=""
                ></el-table-column>
                <el-table-column
                  prop="actAmount"
                  label="成交金额"
                  width=""
                ></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="6">
              <el-card title="付款方式">
                <ul class="space-y-3">
                  <li class="flex items-center">
                    <div class="payment-label">付款方式</div>
                    <div class="text-xl">
                      {{ retailStore.offlinePayment.payway }}
                    </div>
                  </li>
                  <li class="flex items-center">
                    <div class="payment-label">付款金额</div>
                    <div class="text-xl">
                      {{ retailStore.offlinePayment.payAmt }}
                    </div>
                  </li>
                  <!-- <li class="flex items-center">
                    <div class="payment-label">可退金额</div>
                    <div class="text-xl">
                      {{ offlinePayment.canRetAmt }}
                    </div>
                  </li> -->
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="pt-5 text-right">
      <el-button size="large" type="primary" @click="chooseRetail"
        >确定</el-button
      >
      <el-button size="large" @click="retailQueryVisable = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, watch, computed, ref, Ref } from "vue";
import { useVipStore } from "@/stores/vip";
import { useEmployeeStore } from "@/stores/employee";
import { useRetailStore, RetailType } from "@/stores/retail";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/product";
import { usePaywayStore } from "@/stores/payway";
// import { useAuthStore } from "@/stores/auth";
import { userStoreStore } from "@/stores/store";
import { ElMessage, ElMessageBox } from "element-plus";

const vipStore = useVipStore();
const employeeStore = useEmployeeStore();
const paywayStore = usePaywayStore();
const retailStore = useRetailStore();
const productStore = useProductStore();
const storeStore = userStoreStore();

const vipDialogVisible = ref(false);
const payDialogVisible = ref(false);
const vipFormInstance = ref();

const { vipForm } = storeToRefs(vipStore);

const vipRules = ref({});

const rePay = () => {
  retailStore.rePay();
};

const savePay = () => {
  retailStore.savePay();
  payDialogVisible.value = false;
};

const closePayDialog = () => {
  retailStore.rePay();
  payDialogVisible.value = false;
};

const appendPayment = (payway) => {
  ElMessageBox.prompt("请输入金额", payway.name + "付款", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[0-9]*$/,
    inputErrorMessage: "请输入数字",
    inputPlaceholder: "请输入金额",
  }).then((input) => {
    if (input) {
      retailStore.appendPayment({
        paywayId: payway.id,
        name: payway.name,
        payAmt: Number(input.value),
      });
    }
  });
};

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

const employeeDialogSave = () => {
  retailStore.pos.employee = employeeStore.employee.find(
    (e) => e.id == retailStore.pos.salesrepId
  );
  employeeDialogVisible.value = false;
};

const cancelEmployee = () => {
  retailStore.pos.salesrepId = null;
  employeeDialogSave();
};

onMounted(async () => {
  await vipStore.fetchAllVipType();
  await employeeStore.fetchAllEmployee();
  await paywayStore.fetchAllPayway();
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
let productKeyWord = ref("");

let queryVip = async () => {
  await vipStore.fetchVip(vipKeyWord.value);
  vipKeyWord.value = "";
};

const spuMatrix = ref({
  product: {},
  skus: [],
  attributes: [],
  storage: [],
});
const matrixDialogVisible = ref(false);

const colors = computed(() => {
  return spuMatrix.value.attributes.filter((item) => item.type === 1);
});

const sizes = computed(() => {
  return spuMatrix.value.attributes.filter((item) => item.type === 2);
});

const matrixValue = ref({});

const getMatrixValue = (colorId, sizeId) => {
  let sku = spuMatrix.value.skus.find((item) => {
    if (item.colorId === colorId && item.sizeId === sizeId) {
      return true;
    }
  });
  return matrixValue.value[sku.no];
};

const matrixChange = (colorId, sizeId, e) => {
  let sku = spuMatrix.value.skus.find((item) => {
    if (item.colorId === colorId && item.sizeId === sizeId) {
      return true;
    }
  });
  matrixValue.value[sku.no] = e.target.value;
};

const getSpuStorage = (colorId, sizeId) => {
  let sku = spuMatrix.value.skus.find((item) => {
    if (item.colorId === colorId && item.sizeId === sizeId) {
      return true;
    }
  });
  let storage = spuMatrix.value.storage.find((item) => {
    if (item.skuId === sku.id) {
      return true;
    }
  });
  return storage?.qtycan || 0;
};

const closeMatrixDialog = () => {
  spuMatrix.value = {
    product: {},
    skus: [],
    attributes: [],
    storage: [],
  };
  matrixValue.value = {};
  matrixDialogVisible.value = false;
};

const saveMatrixValue = async () => {
  await retailStore.putRetailItem(matrixValue.value);
  closeMatrixDialog();
};

let putItem = async (inputItem) => {
  if (inputItem.type == "spu") {
    // 款号展示矩阵
    matrixDialogVisible.value = true;
    let res = await productStore.fetchMatrix(inputItem.id);
    console.log("🚀 ~ file: pos.vue ~ line 541 ~ putItem ~ res", res);
    spuMatrix.value = res;
  } else {
    // 条码直接录入
    await retailStore.putRetailItem({
      [inputItem.code]: 1,
    });
  }
};

const pdtOptions = ref([]);
const pdtOptionsVisible = ref(false);

watch(productKeyWord, (value, oldValue) => {
  if (!value) {
    pdtOptionsVisible.value = false;
  } else {
    queryProduct();
  }
});

let closePdtOptions = () => {
  pdtOptions.value = [];
  pdtOptionsVisible.value = false;
};
let queryProduct = async () => {
  let res = await productStore.fetchProductKeyWordLikeList(
    productKeyWord.value
  );
  pdtOptions.value = res;
  pdtOptionsVisible.value = true;
};
let queryAndPutItem = async () => {
  // 没有零售单据，创建一个
  closePdtOptions();
  let res = await productStore.fetchProductKeyWord(productKeyWord.value);
  if (!res.length) {
    ElMessage.warning("没有找到对应商品");
  } else {
    if (res.length > 2) {
      pdtOptions.value = res;
      pdtOptionsVisible.value = true;
      return;
    }
    putItem(res[0]);
  }
};

let selectPdt = async (row) => {
  productKeyWord.value = row.code;
  await queryAndPutItem();
  closePdtOptions();
  productKeyWord.value = "";
};

let newRetail = async () => {
  retailStore.createRetail();
};

let hangRetail = async () => {
  retailStore.hangRetail();
};

let deleteItem = async (itemIndex) => {
  await retailStore.delRetailItem(itemIndex);
  ElMessage.success("明细删除成功！");
};

let originRetVisable = ref(false);
let retPayDialogVisible = ref(false);

let toUpper = (e) => {
  productKeyWord.value = e.target.value.toUpperCase();
};

let rowClick = (row, column, event) => {
  retailStore.selectRetailItem = {};
  retailStore.queryRetailItemList(row);
};

let retItemQty = (row, value) => {
  let itemId = row.id;
  retailStore.selectRetailItem[itemId] = {
    value: Number(value),
    priceActual: row.priceActual,
  };
};

let submitOriginRetRetail = async () => {
  retailStore.submitOriginRetRetail();
  retPayDialogVisible.value = false;
};

let openRetPayDialog = () => {
  retailStore.rePay();
  retPayDialogVisible.value = true;
};

let reRetPay = () => {
  retailStore.rePay();
};

let closeRetPayDialog = () => {
  retPayDialogVisible.value = false;
};

let removePayment = (index) => {
  retailStore.removePayment(index);
};

let taggleRetailMode = () => {
  if (retailStore.type == RetailType.RET) {
    retailStore.type = RetailType.SALE;
  } else {
    retailStore.type = RetailType.RET;
  }
  newRetail();
};

let setRetRetailMode = () => {
  taggleRetailMode();
  newRetail();
};

const retailQueryVisable = ref(false);

const openRetailQueryDialog = () => {
  retailStore.currentOfflineRetail = {} 
  retailStore.retailList = [];
  retailStore.retailItemList = [];
  dbRetailList.value = [];
  retailQueryVisable.value = true;
};

const chooseRetail = async () => {
  if(retailStore.currentOfflineRetail.docno){
    retailStore.pos = retailStore.currentOfflineRetail;
    vipStore.vip = retailStore.currentOfflineRetail.vip;
    retailStore.removeDBRetail(retailStore.currentOfflineRetail.docno);
  }else{
    await retailStore.queryPosRetail()
    vipStore.vip = retailStore.pos.vip;
  }
  retailQueryVisable.value = false;
};

const isHang = ref();
const isPay = ref();
const isPush = ref();
const dbRetailList = ref([]);

const queryDBRetail = async () => {
  dbRetailList.value = await retailStore.queryDBRetail({
    isHang: isHang.value,
    isPay: isPay.value,
    isPush: isPush.value,
  });
};


let offlineRowClick = (row, column, event) =>{
  console.log("🚀 ~ file: pos.vue ~ line 1424 ~ offlineRowClick ~ row", row)
  retailStore.currentOfflineRetail = row;
}

</script>

<style scoped>
table.headfix thead,
table.headfix tbody {
  @apply w-full float-left;
}
table.headfix tr {
  @apply h-40px w-full table text-left;
}
table.headfix th,
table.headfix td {
  width: 10%;
  @apply align-top py-3;
}
.box {
  @apply h-80px px-5 py-5;
}

input {
  @apply border h-full rounded px-2 w-240px;
}
.headfix input {
  @apply h-40px w-min-60px;
}
.headline {
  @apply h-40px leading-40px;
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
#matrix thead tr {
  @apply bg-gray-100 h-40px;
}
#matrix thead tr th {
  @apply text-left p-3;
}
#matrix tbody tr {
  @apply bg-gray-100;
}
#matrix tbody tr td:first-child {
  @apply !bg-gray-100;
}
#matrix tbody tr td {
  @apply bg-white p-3;
}

.payment-label {
  @apply w-min-80px text-gray-500;
}
</style>
