<template>
  <div>
    <CCardBody class="custom-card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Approver List</h5>
        <b-button variant="outline-primary" @click="openModal">
          ➕ Add Approver
        </b-button>
      </div>

      <div v-if="approvals.length === 0" class="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
          alt="No Data"
          style="max-width: 160px"
        />
        <p class="mt-3 font-weight-bold">No Approvers</p>
        <p class="text-muted">Click add button to insert approvers</p>
      </div>

      <div v-else>
        <div
          v-for="(item, index) in approvals"
          :key="index"
          class="attachment-item border rounded px-3 py-2 mb-2"
          style="cursor: pointer"
        >
          <div class="d-flex justify-content-between">
            <div>
              <div class="font-weight-bold">
                #{{ index + 1 }} - {{ item.assignType }} : {{ item.employee }}
                <span v-if="item.isHoApprover"> (HO Approver)</span>
              </div>
              <div class="text-muted">{{ item.position }}</div>
            </div>
            <b-button
              variant="link"
              size="sm"
              class="text-danger"
              @click.stop="removeApproval(index)"
            >
              🗑 Delete
            </b-button>
          </div>
        </div>
      </div>
    </CCardBody>

    <!-- Modal: Add/Edit Multiple Approvals -->
    <b-modal
      v-model="showModal"
      @ok="submitApprovals"
      ok-title="Save All"
      size="xl"
    >
      <!-- Header Add Button -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0"></h6>
        <b-button size="sm" @click="addApprovalRow"> ➕ Add Approval </b-button>
      </div>

      <!-- Approval Rows -->
      <div
        v-for="(item, index) in approvalBatch"
        :key="index"
        class="form-row align-items-center mb-3"
      >
        <div class="col-md-3">
          <v-select
            :options="positionOptions"
            v-model="item.position"
            placeholder="Position"
            label="PositionName"
            @input="onPositionSelect(item)"
          />
        </div>
        <div class="col-md-3">
          <v-select
            :options="getEmployeeOptions(item.position)"
            v-model="item.employee"
            placeholder="Employee"
            label="EmployeeName"
            @input="onEmployeeSelect(item)"
          />
        </div>
        <div class="col-md-3">
          <v-select
            :options="assignTypeOptions"
            v-model="item.assignType"
            placeholder="Assign Type"
            label="Description"
          />
        </div>
        <div class="col-md-2 text-right">
          <b-form-checkbox v-model="item.isHoApprover">
            Is HO Approver
          </b-form-checkbox>
        </div>
        <div class="col-md-1 text-right">
          <b-button size="sm" @click="removeApprovalRow(index)">🗑</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, BFormCheckbox } from "bootstrap-vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import BusinessExpenditureService from "../Script/BusinessExpenditureService";
import variable from "../../../../Shared/Variable.vue";
import httpStatusCode from "../../../../Shared/Constants.vue";
import _ from "lodash";

export default {
  components: {
    BButton,
    BModal,
    BFormCheckbox,
    vSelect,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    approvals: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      // approvals: [],
      showModal: false,
      approvalBatch: [],
      assignTypeOptions: [],
      positionOptions: [],
      employees: [],
    };
  },
  mounted() {
    // console.log('memoID dari Approval: ', this.$store.state.memoId);
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.approvalBatch = [
        {
          position: null,
          employee: null,
          assignType: null,
          isHoApprover: false,
        },
      ];
    },
    addApprovalRow() {
      this.approvalBatch.push({
        position: null,
        employee: null,
        assignType: null,
        isHoApprover: false,
      });
    },
    removeApprovalRow(index) {
      this.approvalBatch.splice(index, 1);
    },
    submitApprovals() {
      const validEntries = this.approvalBatch.filter(
        (a) => a.position && a.employee && a.assignType
      );
      if (validEntries.length) {
        // Tambah ke approvals (yang sebenarnya adalah parent data)
        this.approvals = [...this.approvals, ...validEntries];
      }
      this.showModal = false;
    },
    removeApproval(index) {
      this.approvals.splice(index, 1);
    },
    initializeApproval() {
      this.getPositionsAndEmployees();
    },
    getPositionsAndEmployees() {
      this.$loading(true);
      BusinessExpenditureService.GetApprovalMaster({})
        .then((response) => {
          if (response.status === httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (
            typeof response.data !== String(httpStatusCode.UNDEFINED)
          ) {
            const data = response.data.Data;
            this.assignTypeOptions = data.AssignTypes || [];

            this.allEmployees = data.Employees || [];
            this.positionOptions = data.Positions || [];

            // Normalisasi struktur data jika perlu
            // contoh: pastikan allEmployees punya { employeeId, employeeName, PositionId }
          } else {
            this.$swal("Info", this.$globalfunc.ErrorFormat(response), "error");
          }
        })
        .catch((e) => {
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    },
    getEmployeeOptions(position) {
      if (!position) return this.allEmployees;
      return this.allEmployees.filter(
        (e) => e.PositionId === position.PositionId
      );
    },
    onEmployeeSelect(item) {
      if (item.employee && !item.position) {
        const emp = this.allEmployees.find((e) => e.employeeId === item.employee.employeeId);
        if (emp) {
          item.position = this.positionOptions.find(
            (p) => p.PositionId === emp.PositionId
          );
        }
      }
    },
    onPositionSelect(item) {
      // Clear employee if it doesn't match selected position
      if (
        item.employee &&
        item.employee.PositionId !== item.position.PositionId
      ) {
        item.employee = null;
      }
    },
  },
};
</script>

<style scoped>
.custom-card-body {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 15px;
  background-color: #fff;
  min-height: 400px;
}
.attachment-item {
  transition: background-color 0.2s ease;
}
.attachment-item:hover {
  background-color: #f8f9fa;
}
</style>
