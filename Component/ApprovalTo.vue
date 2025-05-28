<template>
  <div>
    <CCardBody class="custom-card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="font-weight-bold">Approver List</h5>
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
          @click="openEditModal(index)"
        >
          <div class="d-flex justify-content-between">
            <div>
              <div class="font-weight-bold">
                {{ index + 1 }} - {{ getAssignTypeText(item) }} :
                {{ getEmployeeText(item) }}
              </div>
              <span class="ishoapp" v-if="item.isHoApprover">
                (Is HO Approver)</span
              >
              <div class="text-muted pt-2">{{ getPositionText(item) }}</div>
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

    <!-- Modal Add/Edit -->
    <b-modal
      v-model="showModal"
      @ok="submitApprovals"
      :ok-title="editIndex !== null ? 'Save Changes' : 'Save All'"
      size="xl"
      :title="editIndex !== null ? 'Edit Approver' : 'Add Approver'"
    >
      <!-- Header Add Button (hanya untuk mode tambah) -->
      <div
        v-if="editIndex === null"
        class="d-flex justify-content-between align-items-center mb-3"
      >
        <h6 class="mb-0"></h6>
        <b-button size="sm" @click="addApprovalRow"> ➕ Add Approval </b-button>
      </div>

      <!-- Approval Rows -->
      <div
        v-for="(item, index) in approvalBatch"
        :key="index"
        class="form-row align-items-center mb-3"
      >
        <div class="col-md-4">
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
            :clearable="true"
          />
        </div>
        <div class="col-md-2">
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
        <div class="col-md-1 text-right" v-if="editIndex === null">
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
      showModal: false,
      approvalBatch: [],
      assignTypeOptions: [],
      positionOptions: [],
      employees: [],
      allEmployees: [],
      editIndex: null, // Tambahan untuk mode edit
    };
  },
  mounted() {
    this.getPositionsAndEmployees();
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.editIndex = null;
      // Untuk tambah baru, form kosong
      this.approvalBatch = [
        {
          position: null,
          employee: null,
          assignType: null,
          isHoApprover: false,
        },
      ];
    },
    openEditModal(index) {
      this.editIndex = index;
      this.showModal = true;
      // Isi form dengan data yang akan diedit (hanya satu row)
      this.approvalBatch = [
        {
          position: this.approvals[index].position,
          employee: this.approvals[index].employee,
          assignType: this.approvals[index].assignType,
          isHoApprover: this.approvals[index].isHoApprover,
        },
      ];
    },
    initializeApproval() {
      this.getPositionsAndEmployees();
      this.snapshotInitialApprovalTo();
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
      if (!validEntries.length) {
        this.showModal = false;
        return;
      }
      if (this.editIndex !== null) {
        // mode edit
        const newApprovals = [...this.approvals];
        newApprovals[this.editIndex] = validEntries[0];
        this.approvals = newApprovals;
      } else {
        // mode tambah
        this.approvals = [...this.approvals, ...validEntries];
      }
      this.showModal = false;
      this.editIndex = null;
    },
    removeApproval(index) {
      this.approvals.splice(index, 1);
    },
    getPositionsAndEmployees() {
      this.$loading && this.$loading(true);
      BusinessExpenditureService.GetApprovalMaster({})
        .then((response) => {
          if (response.status === httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (
            typeof response.data !== String(httpStatusCode.UNDEFINED)
          ) {
            const data = response.data.Data;
            console.log("data approval: ", data);
            this.assignTypeOptions = data.AssignTypes || [];
            this.allEmployees = data.Employees || [];
            this.positionOptions = data.Positions || [];
          } else {
            this.$swal("Info", this.$globalfunc.ErrorFormat(response), "error");
          }
        })
        .catch((e) => {
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
          this.$loading && this.$loading(false);
        });
    },
    getEmployeeOptions(position) {
      if (!position) return this.allEmployees;
      return this.allEmployees.filter(
        (e) => e.PositionId === position.PositionId
      );
    },
    onEmployeeSelect(item) {
      if (!item.employee) {
        // Jika employee dihapus, posisi juga direset
        item.position = null;
        item.isHoApprover = false; // reset juga!
        return;
      }
      // Normal: jika pilih employee, posisi otomatis terisi
      const emp = this.allEmployees.find(
        (e) => e.EmployeeID === item.employee.EmployeeID
      );
      if (emp) {
        item.position = this.positionOptions.find(
          (p) => p.PositionId === emp.PositionId
        );
        item.isHoApprover = !!emp.IsHOApprover;
      }
    },
    onPositionSelect(item) {
      if (
        item.employee &&
        item.employee.PositionId !== item.position.PositionId
      ) {
        item.employee = null;
      }
    },
    getPositionText(item) {
      if (typeof item.position === "string") return item.position;
      if (item.position && item.position.PositionName)
        return item.position.PositionName;
      return "";
    },
    getEmployeeText(item) {
      if (typeof item.employee === "string") return item.employee;
      if (item.employee && item.employee.EmployeeName)
        return item.employee.EmployeeName;
      return "";
    },
    getAssignTypeText(item) {
      if (typeof item.assignType === "string") return item.assignType;
      if (item.assignType && item.assignType.Description)
        return item.assignType.Description;
      return "";
    },
    snapshotInitialApprovalTo() {
      this._initialApprovalTo = this.approvals.map((f) => ({
        position: f.position,
        employee: f.employee,
        assignType: f.assignType,
        isHoApprover: f.isHoApprover,
      }));
    },
    isApprovalToChanged() {
      if (!this._initialApprovalTo) return true;
      const arr1 = this.approvals.map((f) => ({
        position: f.position,
        employee: f.employee,
        assignType: f.assignType,
        isHoApprover: f.isHoApprover,
      }));
      const arr2 = this._initialApprovalTo.map((f) => ({
        position: f.position,
        employee: f.employee,
        assignType: f.assignType,
        isHoApprover: f.isHoApprover,
      }));
      return JSON.stringify(arr1) !== JSON.stringify(arr2);
    },
    async saveApprovalTo() {
      if (!this.isApprovalToChanged()) {
        // Tidak perlu save ulang jika tidak ada perubahan
        return true;
      }
      const memoId = this.$store.state.memoId;  
      var branchCode = variable.currentUser().BranchRoleId
      if (branchCode === 1) {
        branchCode = '01'
      }
      console.log('bcd: ', branchCode);
      
      if (!memoId) {
        this.$swal(
          "Error",
          "Memo ID tidak ditemukan!",
          "error"
        );
        return false;
      }

      // Siapkan payload sesuai backend
      const payload = {
        MemoID: memoId,
        BranchCode: branchCode,
        Approvers: this.approvals.map((item, idx) => ({
          Sequence: idx + 1,
          PositionID: item.position?.PositionId || "",
          EmployeeID: item.employee?.EmployeeID || "",
          AssignTypeID:
            item.assignType?.AssignTypeID || item.assignType?.Value || 2,
          IsHOApprover: !!item.isHoApprover,
        })),
      };

      try {
        const res = await BusinessExpenditureService.SaveApprovalTo(payload);
        if (res.Status === 1) {
          this.snapshotInitialApprovalTo();
          this.$router.push({ name: "Business Eexpenditure" });
          return true;
        } else {
          this.$swal(
            "Error",
            res.data && res.data.Errors
              ? res.data.Errors
              : "Failed to save Approval To",
            "error"
          );
          return false;
        }
      } catch (e) {
        this.$swal("Error", e.message || "Failed to save Approval To", "error");
        return false;
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
.text-muted {
  font-size: 10px;
}
.ishoapp {
  font-size: 10px;
  background-color: rgb(221, 193, 248);
  padding: 2px;
  border-radius: 5px;
}
</style>
