<template>
  <div>
    <CCardBody class="custom-card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Data Memo To</h5>
        <b-button variant="outline-primary" @click="openAddModal">
          ➕ Add Memo To
        </b-button>
      </div>

      <!-- No Data -->
      <div v-if="memoList.length === 0" class="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
          alt="No Data"
          style="max-width: 160px"
        />
        <p class="mt-3 font-weight-bold">No Data</p>
        <p class="text-muted">Click add button to add memo recipients</p>
      </div>

      <!-- List -->
      <div v-else>
        <div
          v-for="(item, index) in memoList"
          :key="index"
          class="attachment-item border rounded px-3 py-2 mb-2"
          style="cursor: pointer"
          @click="openEditModal(index)"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <strong class="text-primary mr-2"
                >#{{ index + 1 }} - {{ item.branch.label }}</strong
              >
            </div>
            <div class="pl-4 text-muted small">
              {{ item.position.label }} / {{ item.receiver.label }}
            </div>
            <b-button
              variant="link"
              size="sm"
              class="text-danger"
              @click.stop="removeMemo(index)"
            >
              🗑 Delete
            </b-button>
          </div>
        </div>
      </div>
    </CCardBody>

    <!-- Add Modal -->
    <b-modal
      v-model="showAddModal"
      title="Add Memo To"
      @ok="addMemo"
      ok-title="Add"
    >
      <b-form-group label="Branch">
        <v-select
          :options="
            memoToStructure.map((b) => ({
              label: b.BranchName,
              value: b.BranchCode,
            }))
          "
          v-model="newMemo.branch"
          @input="onBranchChange"
          label="label"
        />
      </b-form-group>
      <b-form-group label="Position">
        <v-select
          :options="filteredPositions"
          v-model="newMemo.position"
          @input="onPositionChange"
          :disabled="!newMemo.branch"
          label="label"
        />
      </b-form-group>
      <b-form-group label="Receiver">
        <v-select
          :options="filteredEmployees"
          v-model="newMemo.receiver"
          :disabled="!newMemo.position"
          label="label"
        />
      </b-form-group>
    </b-modal>

    <!-- Edit Modal -->
    <b-modal
      v-model="showEditModal"
      title="Edit Memo To"
      @ok="saveEdit"
      ok-title="Save Changes"
    >
      <b-form-group label="Branch">
        <v-select
          :options="
            memoToStructure.map((b) => ({
              label: b.BranchName,
              value: b.BranchCode,
            }))
          "
          v-model="editMemo.branch"
          @input="onEditBranchChange"
          label="label"
        />
      </b-form-group>
      <b-form-group label="Position">
        <v-select
          :options="editFilteredPositions"
          v-model="editMemo.position"
          @input="onEditPositionChange"
          :disabled="!editMemo.branch"
          label="label"
        />
      </b-form-group>
      <b-form-group label="Receiver">
        <v-select
          :options="editFilteredEmployees"
          v-model="editMemo.receiver"
          :disabled="!editMemo.position"
          label="label"
        />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, BFormGroup } from "bootstrap-vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import BusinessExpenditureService from "../Script/BusinessExpenditureService";
import variable from "../../../../Shared/Variable.vue";
import httpStatusCode from "../../../../Shared/Constants.vue";

export default {
  components: {
    BButton,
    BModal,
    BFormGroup,
    vSelect,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    memoList: {
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
      // memoList: [],
      showAddModal: false,
      showEditModal: false,
      selectedEditIndex: null,
      newMemo: {
        branch: null,
        position: null,
        receiver: null,
      },
      editMemo: {
        branch: null,
        position: null,
        receiver: null,
      },
      branches: [],
      positions: [],
      receivers: [],
      memoToStructure: [], // Data struktur dari backend
      // Untuk dropdown dinamis
      filteredPositions: [],
      filteredEmployees: [],
      editFilteredPositions: [],
      editFilteredEmployees: [],
    };
  },
  created() {
    this.getBranchWithPositionsAndEmployees();
  },
  mounted() {
    this.getBranchWithPositionsAndEmployees();
  },
  methods: {
    addMemo() {
      if (
        this.newMemo.branch &&
        this.newMemo.position &&
        this.newMemo.receiver
      ) {
        this.memoList.push({ ...this.newMemo });
        this.newMemo = { branch: null, position: null, receiver: null };
      }
    },
    removeMemo(index) {
      this.memoList.splice(index, 1);
    },
    openEditModal(index) {
      this.selectedEditIndex = index;
      const selected = this.memoList[index];
      // Reset editMemo dan filtered dropdowns
      this.editMemo = { branch: null, position: null, receiver: null };
      this.editFilteredPositions = [];
      this.editFilteredEmployees = [];
      // Jika ingin auto-isi sesuai data lama:
      if (
        selected &&
        selected.branch &&
        selected.position &&
        selected.receiver
      ) {
        // Temukan branch
        const foundBranch = this.memoToStructure.find(
          (b) =>
            b.BranchCode === selected.branch.value ||
            b.BranchName === selected.branch.label
        );
        if (foundBranch) {
          this.editMemo.branch = {
            label: foundBranch.BranchName,
            value: foundBranch.BranchCode,
          };
          this.editFilteredPositions = foundBranch.Positions.map((p) => ({
            label: p.PositionDesc,
            value: p.PositionID,
            Employees: p.Employees,
          }));
          // Temukan posisi
          const foundPos = foundBranch.Positions.find(
            (p) =>
              p.PositionID === selected.position.value ||
              p.PositionDesc === selected.position.label
          );
          if (foundPos) {
            this.editMemo.position = {
              label: foundPos.PositionDesc,
              value: foundPos.PositionID,
            };
            this.editFilteredEmployees = foundPos.Employees.map((e) => ({
              label: e.FullName,
              value: e.EmployeeID,
            }));
            // Temukan employee
            const foundEmp = foundPos.Employees.find(
              (e) =>
                e.EmployeeID === selected.receiver.value ||
                e.FullName === selected.receiver.label
            );
            if (foundEmp) {
              this.editMemo.receiver = {
                label: foundEmp.FullName,
                value: foundEmp.EmployeeID,
              };
            }
          }
        }
      }
      this.showEditModal = true;
    },
    saveEdit() {
      if (
        this.editMemo.branch &&
        this.editMemo.position &&
        this.editMemo.receiver &&
        this.selectedEditIndex !== null
      ) {
        this.memoList.splice(this.selectedEditIndex, 1, { ...this.editMemo });
        this.showEditModal = false;
        this.selectedEditIndex = null;
      }
    },
    getBranchWithPositionsAndEmployees() {
      this.$loading(true);
      let item = {
        LeaseNo: this.LeaseNo,
      };
      BusinessExpenditureService.GetMemoToStructure(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (
            typeof response.data !== String(httpStatusCode.UNDEFINED)
          ) {
            if (
              response.data &&
              response.data.Data &&
              response.data.Data.length > 0
            ) {
              // Simpan struktur ke state
              this.memoToStructure = response.data.Data[0];
            }
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
    // Saat modal add dibuka, reset dan isi branch
    openAddModal() {
      this.newMemo = { branch: null, position: null, receiver: null };
      this.filteredPositions = [];
      this.filteredEmployees = [];
      this.showAddModal = true;
    },
    // Saat branch dipilih
    onBranchChange(branch) {
      const found = this.memoToStructure.find(
        (b) => b.BranchName === branch.label
      );
      this.filteredPositions = found
        ? found.Positions.map((p) => ({
            label: p.PositionDesc,
            value: p.PositionID,
            Employees: p.Employees,
          }))
        : [];
      this.newMemo.position = null;
      this.filteredEmployees = [];
      this.newMemo.receiver = null;
    },
    // Saat posisi dipilih
    onPositionChange(positionObj) {
      const foundPos = this.filteredPositions.find(
        (p) => p.value === (positionObj && positionObj.value)
      );
      this.filteredEmployees = foundPos
        ? foundPos.Employees.map((e) => ({
            label: e.FullName,
            value: e.EmployeeID,
          }))
        : [];
      this.newMemo.receiver = null;
    },
    // Inisialisasi data MemoTo dari parent/luar
    initializeMemoTo() {
      this.getBranchWithPositionsAndEmployees();
      console.log("MemoTo initialized with:", this.memoList);

      // Jika ingin reset data, bisa tambahkan reset newMemo/editMemo/memoList di sini
    },
    // Saat branch dipilih di edit modal
    onEditBranchChange(branch) {
      const found = this.memoToStructure.find(
        (b) => b.BranchCode === branch.value || b.BranchName === branch.label
      );
      this.editFilteredPositions = found
        ? found.Positions.map((p) => ({
            label: p.PositionDesc,
            value: p.PositionID,
            Employees: p.Employees,
          }))
        : [];
      this.editMemo.position = null;
      this.editFilteredEmployees = [];
      this.editMemo.receiver = null;
    },
    // Saat posisi dipilih di edit modal
    onEditPositionChange(positionObj) {
      const foundPos = this.editFilteredPositions.find(
        (p) => p.value === (positionObj && positionObj.value)
      );
      this.editFilteredEmployees = foundPos
        ? foundPos.Employees.map((e) => ({
            label: e.FullName,
            value: e.EmployeeID,
          }))
        : [];
      this.editMemo.receiver = null;
    },
    isMemoToChanged() {
      if (!this._initialMemoTo) return true;
      // Bandingkan isi array (branch, position, receiver)
      const arr1 = this.memoList.map((f) => ({
        branch: f.branch && f.branch.value,
        position: f.position && f.position.value,
        receiver: f.receiver && f.receiver.value,
      }));
      const arr2 = this._initialMemoTo.map((f) => ({
        branch: f.branch && f.branch.value,
        position: f.position && f.position.value,
        receiver: f.receiver && f.receiver.value,
      }));
      return JSON.stringify(arr1) !== JSON.stringify(arr2);
    },
    snapshotInitialMemoTo() {
      this._initialMemoTo = this.memoList.map((f) => ({
        branch: f.branch,
        position: f.position,
        receiver: f.receiver,
      }));
    },
    async save() {
      if (!this.isMemoToChanged()) {
        // Tidak perlu save ulang jika tidak ada perubahan
        return true;
      }
      // Ambil MemoId dari parent (expenditureData) via $parent atau prop jika ada
      const memoId =
        this.$parent &&
        this.$parent.expenditureData &&
        this.$parent.expenditureData.MemoId
          ? this.$parent.expenditureData.MemoId
          : this.memoId || "";
      if (!memoId) {
        this.$swal("Error", "Memo ID tidak ditemukan!", "error");
        return false;
      }
      // console.log('memoto save: ', this.memoList);

      // Siapkan payload sesuai backend
      const payload = {
        MemoId: memoId,
        Receivers: this.memoList.map((item) => ({
          BranchCd: item.branch.value,
          PositionID: item.position.value,
          EmployeeID: item.receiver.value,
          FullName: item.receiver.label,
        })),
      };
      try {
        console.log("test");

        const res = await BusinessExpenditureService.SaveMemoTo(payload);
        console.log("Save Memo To Response:", res);

        if (res.Status === 1) {
          // this.$swal('Success', 'Memo To saved successfully!', 'success');
          this.snapshotInitialMemoTo();
          return true;
        } else {
          this.$swal(
            "Error",
            res.data && res.data.Errors
              ? res.data.Errors
              : "Failed to save Memo To",
            "error"
          );
          return false;
        }
      } catch (e) {
        this.$swal("Error", e.message || "Failed to save Memo To", "error");
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
</style>
