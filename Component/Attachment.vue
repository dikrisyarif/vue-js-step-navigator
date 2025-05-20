<style scoped>
.custom-card-body {
  border-radius: 10px; /* Membuat sudut membulat */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan halus */
  margin-top: 10px; /* Memberikan jarak antar card */
  margin-bottom: 10px; /* Memberikan jarak antar card */
  padding: 15px; /* Memberikan padding pada card */
  background-color: #fff; /* Background putih agar lebih bersih */
  min-height: 400px;
}
.attachment-item {
  transition: background-color 0.2s ease;
}
.attachment-item:hover {
  background-color: #f8f9fa;
}
</style>
<template>
  <div>
    <!-- Header -->
    <CCardBody class="custom-card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>List of Attachments</h5>
        <b-button variant="outline-primary" @click="showAddModal = true">
          ➕ Add Attachment
        </b-button>
      </div>

      <!-- No Data State -->
      <div v-if="attachments.length === 0" class="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
          alt="No Data"
          style="max-width: 160px"
        />
        <p class="mt-3 font-weight-bold">No Data</p>
        <p class="text-muted">
          Click add button to submit your trip attachment files<br />
          such as ID Card/Passport, or trip documentations
        </p>
      </div>

      <!-- Attachment Cards -->
      <!-- Attachment List -->
      <div v-else>
        <div
          v-for="(file, index) in attachments"
          :key="index"
          class="attachment-item border rounded px-3 py-2 mb-2"
          @click="openActionModal(index)"
          style="cursor: pointer"
        >
          <!-- Baris atas: No dan Title -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <strong class="text-primary mr-2">
                #{{ String(index + 1).padStart(2, "0") }}
              </strong>
              <div class="font-weight-bold">{{ file.title }}</div>
            </div>
            <!-- Tombol Hapus -->
            <b-button
              variant="link"
              @click.stop="removeAttachment(index)"
              size="sm"
              class="text-danger"
            >
              🗑 Delete
            </b-button>
          </div>
          <!-- Baris bawah: filename -->
          <div class="pl-4 mt-1 text-muted small">
            {{ file.filename }}
          </div>
        </div>
      </div>
    </CCardBody>
    <!-- Add Attachment Modal -->
    <b-modal
      v-model="showAddModal"
      title="Add Attachment"
      @ok="addAttachment"
      ok-title="Add"
    >
      <b-form-group label="Title" label-for="attachment-title">
        <b-form-input id="attachment-title" v-model="newTitle" required />
      </b-form-group>
      <b-form-group label="Upload File" label-for="attachment-file">
        <b-form-file
          id="attachment-file"
          v-model="newFile"
          :state="Boolean(newFile)"
          required
        />
      </b-form-group>
    </b-modal>

    <!-- Edit Attachment Modal -->
    <b-modal
      v-model="showActionModal"
      title="Edit Attachment"
      @hidden="resetTemp"
      hide-footer
    >
      <div v-if="tempSelectedFile">
        <div class="mb-3">
          <label class="form-label">
            Title<span class="text-danger">*</span>
          </label>
          <b-form-input
            v-model="tempSelectedFile.title"
            required
          ></b-form-input>
        </div>

        <div class="mb-3">
          <label class="form-label">Files</label>

          <!-- Jika file masih ada, tampilkan info file + tombol Preview/Delete -->
          <div
            v-if="tempSelectedFile.file"
            class="d-flex justify-content-between align-items-center border p-2 rounded"
          >
            <div>
              🖼 {{ tempSelectedFile.filename }}
              <div class="text-muted small">
                {{ (tempSelectedFile.file.size / 1024).toFixed(3) }} KB
              </div>
            </div>
            <div>
              <b-button variant="link" size="sm" @click="previewFile"
                >Preview</b-button
              >
              <b-button
                variant="link"
                size="sm"
                class="text-danger"
                @click="clearTempFile"
              >
                🗑
              </b-button>
            </div>
          </div>

          <!-- Jika file dihapus, tampilkan upload baru -->
          <div v-else class="text-center border p-4 rounded">
            <div style="font-size: 32px">☁️⬆️</div>
            <div class="font-weight-bold mt-2">Upload File</div>
            <div class="text-muted small mb-2">
              JPG, PNG, PDF, or MP4, file size no more than 2MB
            </div>
            <b-form-file
              v-model="tempSelectedFile.file"
              accept=".jpg,.jpeg,.png,.pdf,.mp4"
              :state="Boolean(tempSelectedFile.file)"
            ></b-form-file>
          </div>
        </div>

        <b-button block variant="primary" @click="saveChanges">
          SAVE CHANGES
        </b-button>
      </div>
    </b-modal>

    <!-- Image Preview Modal -->
    <b-modal
      v-model="showImagePreview"
      title="Preview Image"
      hide-footer
      size="lg"
    >
      <img :src="previewImageUrl" alt="Preview" class="img-fluid" />
    </b-modal>
  </div>
</template>

<script>
import {
  BButton,
  BModal,
  BFormGroup,
  BFormInput,
  BFormFile,
} from "bootstrap-vue"; // <== Tanpa BIcon

export default {
  components: {
    BButton,
    BModal,
    BFormGroup,
    BFormInput,
    BFormFile,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      //   attachments: [],
      newFile: null,
      newTitle: "",
      showAddModal: false,
      showActionModal: false,
      selectedFileIndex: null,
      showImagePreview: false,
      previewImageUrl: "",
      tempSelectedFile: null,
    };
  },
  computed: {
    attachments: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    selectedFile() {
      return this.attachments[this.selectedFileIndex] || null;
    },
    memoId() {
      return this.$store.state.memoId;
    },
  },
  methods: {
    initializeAttachment() {
      // Bersihkan semua modal & state sementara saat komponen aktif
      this.showAddModal = false;
      this.showActionModal = false;
      this.showImagePreview = false;
      this.selectedFileIndex = null;
      this.previewImageUrl = "";
      this.tempSelectedFile = null;

      // Logika tambahan kalau kamu perlu refresh data berdasarkan memoId
      if (!this.memoId) {
        console.warn("Memo ID belum tersedia saat inisialisasi attachment.");
      } else {
        console.log("Inisialisasi Attachment dengan Memo ID:", this.memoId);
        // Di sini kamu bisa tambahkan fetchAttachmentByMemoId(this.memoId) jika diperlukan
      }
    },
    addAttachment() {
      if (this.newFile && this.newTitle) {
        this.attachments.push({
          title: this.newTitle,
          filename: this.newFile.name,
          file: this.newFile,
        });
        this.newFile = null;
        this.newTitle = "";
      }
    },
    removeAttachment(index) {
      this.attachments.splice(index, 1);
    },
    cekmemo() {
      console.log("Current Vuex store:", this.$store.state);
    },
    previewFile() {
      const file = this.selectedFile;
      if (!file) return;

      const fileURL = URL.createObjectURL(file.file);
      const ext = file.filename.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png"].includes(ext)) {
        this.previewImageUrl = fileURL;
        this.showImagePreview = true;
      } else if (["doc", "docx", "xls", "xlsx"].includes(ext)) {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = file.filename;
        link.target = "_blank";
        link.click();
      } else {
        window.open(fileURL, "_blank");
      }

      this.showActionModal = false;
    },

    replaceFile() {
      if (this.selectedFileIndex !== null) {
        this.attachments.splice(this.selectedFileIndex, 1);
        this.showActionModal = false;
        this.showAddModal = true;
      }
    },
    saveChanges() {
      if (this.selectedFileIndex !== null && this.tempSelectedFile) {
        this.attachments[this.selectedFileIndex] = { ...this.tempSelectedFile };
        this.attachments[this.selectedFileIndex].filename =
          this.attachments[this.selectedFileIndex].file.name;
        console.log(
          "att: ",
          this.attachments[this.selectedFileIndex].filename,
          this.attachments[this.selectedFileIndex].file.name
        );
      }
      this.showActionModal = false;
      this.selectedFileIndex = null;
    },
    clearTempFile() {
      if (this.tempSelectedFile) {
        this.tempSelectedFile.file = null;
        this.tempSelectedFile.filename = "";
      }
    },
    resetTemp() {
      // Reset ke data sebelum diedit jika user batal ubah
      if (this.selectedFileIndex !== null) {
        const original = this.attachments[this.selectedFileIndex];
        this.tempSelectedFile = { ...original };
      }
    },
    // previewTempFile() {
    //   const file = this.tempSelectedFile;
    //   if (!file || !file.file) return;

    //   const fileURL = URL.createObjectURL(file.file);
    //   const ext = file.filename.split(".").pop().toLowerCase();

    //   if (["doc", "docx", "xls", "xlsx"].includes(ext)) {
    //     const link = document.createElement("a");
    //     link.href = fileURL;
    //     link.download = file.filename;
    //     link.target = "_blank";
    //     link.click();
    //   } else {
    //     this.previewImageUrl = fileURL;
    //     this.showImagePreview = true;
    //   }

    //   this.showActionModal = false;
    // },
    openActionModal(index) {
      this.selectedFileIndex = index;
      const selected = this.attachments[index];
      this.tempSelectedFile = {
        title: selected.title,
        filename: selected.filename,
        file: selected.file,
      };
      this.showActionModal = true;
    },
  },
};
</script>
