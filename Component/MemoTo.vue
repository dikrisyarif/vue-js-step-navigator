<template>
  <div>
    <CCardBody class="custom-card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Data Memo To</h5>
        <b-button variant="outline-primary" @click="showAddModal = true">
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
          <div class="d-flex justify-content-between">
            <div>
              <strong>#{{ index + 1 }}</strong> - {{ item.branch }} /
              {{ item.position }} / {{ item.receiver }}
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
        <v-select :options="branches" v-model="newMemo.branch" />
      </b-form-group>
      <b-form-group label="Position">
        <v-select :options="positions" v-model="newMemo.position" />
      </b-form-group>
      <b-form-group label="Receiver">
        <v-select :options="receivers" v-model="newMemo.receiver" />
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
        <v-select :options="branches" v-model="editMemo.branch" />
      </b-form-group>
      <b-form-group label="Position">
        <v-select :options="positions" v-model="editMemo.position" />
      </b-form-group>
      <b-form-group label="Receiver">
        <v-select :options="receivers" v-model="editMemo.receiver" />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, BFormGroup } from "bootstrap-vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

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
      branches: ["Jakarta", "Bandung", "Surabaya"],
      positions: ["Manager", "Supervisor", "Staff"],
      receivers: ["John Doe", "Jane Smith", "Alice"],
    };
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
      this.editMemo = { ...selected };
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
