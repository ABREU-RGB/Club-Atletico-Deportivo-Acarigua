<template>
  <div class="plantel-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1><i class="el-icon-s-custom" /> Gestión del Plantel</h1>
          <p class="subtitle">Club Atlético Deportivo Acarigua</p>
        </div>
        <el-button type="primary" icon="el-icon-plus" class="header-action-btn" @click="handleCreate">
          Nuevo Miembro
        </el-button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar con lista de miembros -->
      <aside class="sidebar">
        <el-card shadow="hover">
          <div slot="header" class="sidebar-header">
            <span><i class="el-icon-user" /> Lista del Plantel</span>
            <el-popover placement="bottom-end" width="250" trigger="click">
              <div class="filter-popover">
                <h4>Filtros Avanzados</h4>
                <div class="filter-item">
                  <label>Rol</label>
                  <el-select
                    v-model="filterRol"
                    placeholder="Filtrar por Rol"
                    clearable
                    size="small"
                    style="width: 100%"
                    @change="fetchPlantel"
                  >
                    <el-option
                      v-for="rol in rolesOptions"
                      :key="rol.value"
                      :label="rol.label"
                      :value="rol.value"
                    />
                  </el-select>
                </div>
              </div>
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-s-operation"
                class="filter-btn"
              />
            </el-popover>
          </div>
          <div class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="Buscar por nombre..."
              prefix-icon="el-icon-search"
              size="small"
              clearable
            />
          </div>
          <div class="member-list">
            <div
              v-for="miembro in filteredPlantel"
              :key="miembro.plantel_id"
              class="member-item"
              :class="{ active: currentMemberId === miembro.plantel_id }"
              @click="selectMember(miembro)"
            >
              <div class="member-photo">
                <i class="el-icon-user" />
              </div>
              <div class="member-info">
                <h3>{{ miembro.nombre }} {{ miembro.apellido }}</h3>
                <p>{{ miembro.rol }}</p>
                <p>
                  <i class="el-icon-phone-outline" />
                  {{ miembro.telefono || "Sin teléfono" }}
                </p>
              </div>
            </div>
            <div v-if="filteredPlantel.length === 0" class="empty-state-list">
              <p>No se encontraron miembros</p>
            </div>
          </div>
        </el-card>
      </aside>

      <!-- Área de contenido -->
      <main class="content-area">
        <el-card v-if="!currentMemberId" shadow="hover">
          <div class="empty-state">
            <i class="el-icon-s-custom" style="font-size: 4rem; color: #ddd" />
            <h3>No hay miembro seleccionado</h3>
            <p>Selecciona un miembro de la lista o agrega uno nuevo.</p>
          </div>
        </el-card>

        <el-card v-else shadow="hover">
          <!-- Encabezado del miembro -->
          <div class="member-details-header">
            <div class="member-details-photo">
              <i class="el-icon-user" />
            </div>
            <div class="member-details-info">
              <h2>{{ currentMember.nombre }} {{ currentMember.apellido }}</h2>
              <el-tag :type="getRolTagType(currentMember.rol)">{{
                currentMember.rol
              }}</el-tag>
              <p style="margin-top: 10px">
                <i class="el-icon-phone" />
                {{ currentMember.telefono || "No especificado" }}
              </p>
            </div>
            <div class="member-actions">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(currentMember)"
              >Eliminar</el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(currentMember)"
              >Editar</el-button>
            </div>
          </div>

          <!-- Tabs -->
          <el-tabs
            v-model="activeTab"
            type="border-card"
            style="margin-top: 20px"
          >
            <!-- Tab 1: Datos Personales (Por ahora la única) -->
            <el-tab-pane label="Datos Generales" name="general">
              <div class="form-grid">
                <div class="form-item">
                  <label>Nombre</label>
                  <p>{{ currentMember.nombre }}</p>
                </div>
                <div class="form-item">
                  <label>Apellido</label>
                  <p>{{ currentMember.apellido }}</p>
                </div>
                <div class="form-item">
                  <label>Rol</label>
                  <p>{{ currentMember.rol }}</p>
                </div>
                <div class="form-item">
                  <label>Teléfono</label>
                  <p>{{ currentMember.telefono || "No especificado" }}</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </main>
    </div>

    <!-- Dialog Crear/Editar -->
    <el-dialog
      :title="isEdit ? 'Editar Miembro' : 'Nuevo Miembro'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="plantelForm"
        :model="formData"
        :rules="formRules"
        label-width="90px"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Nombre" prop="nombre">
              <el-input
                v-model="formData.nombre"
                placeholder="Ingrese nombre"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Apellido" prop="apellido">
              <el-input
                v-model="formData.apellido"
                placeholder="Ingrese apellido"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Teléfono" prop="telefono">
              <el-input
                v-model="formData.telefono"
                placeholder="+58 412-1234567"
                maxlength="13"
                @input="filterOnlyNumbers"
              >
                <i slot="prefix" class="el-icon-phone" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Rol" prop="rol">
              <el-select
                v-model="formData.rol"
                placeholder="Seleccione rol"
                style="width: 100%"
              >
                <el-option
                  v-for="rol in rolesOptions"
                  :key="rol.value"
                  :label="rol.label"
                  :value="rol.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? "Actualizar" : "Crear" }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPlantel,
  createPlantel,
  updatePlantel,
  deletePlantel
} from '@/api/plantel'

export default {
  name: 'PlantelIndex',
  data() {
    return {
      loading: false,
      submitting: false,
      plantelList: [],
      filterRol: '',
      searchQuery: '',
      dialogVisible: false,
      isEdit: false,
      currentMemberId: null,
      currentMember: {},
      activeTab: 'general',
      editingId: null,
      formData: {
        nombre: '',
        apellido: '',
        telefono: '',
        rol: ''
      },
      formRules: {
        nombre: [
          {
            required: true,
            message: 'El nombre es obligatorio',
            trigger: 'blur'
          }
        ],
        apellido: [
          {
            required: true,
            message: 'El apellido es obligatorio',
            trigger: 'blur'
          }
        ],
        telefono: [
          {
            pattern: /^[0-9]*$/,
            message: 'Solo se permiten números',
            trigger: 'blur'
          }
        ],
        rol: [
          { required: true, message: 'Seleccione un rol', trigger: 'change' }
        ]
      },
      rolesOptions: [
        { value: 'ENTRENADOR', label: 'Entrenador' },
        { value: 'ASISTENTE', label: 'Asistente / Auxiliar' },
        { value: 'PREPARADOR_FISICO', label: 'Preparador Físico' },
        { value: 'MEDICO', label: 'Médico' },
        { value: 'ADMINISTRATIVO', label: 'Administrativo / Directivo' }
      ]
    }
  },
  computed: {
    filteredPlantel() {
      let filtered = this.plantelList
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nombre.toLowerCase().includes(query) ||
            m.apellido.toLowerCase().includes(query)
        )
      }
      return filtered
    }
  },
  created() {
    this.fetchPlantel()
  },
  methods: {
    filterOnlyNumbers() {
      // Remover cualquier carácter que no sea número
      this.formData.telefono = this.formData.telefono.replace(/[^0-9]/g, '')
    },
    async fetchPlantel() {
      this.loading = true
      try {
        const params = {}
        if (this.filterRol) {
          params.rol = this.filterRol
        }
        const response = await getPlantel(params)
        this.plantelList = response.data || response || []

        // Si hay un miembro seleccionado, actualizar sus datos
        if (this.currentMemberId) {
          const found = this.plantelList.find(
            (p) => p.plantel_id === this.currentMemberId
          )
          if (found) {
            this.currentMember = found
          } else {
            this.currentMemberId = null
          }
        }
      } catch (error) {
        console.error('Error cargando plantel:', error)
        this.$message.error('Error al cargar el plantel')
      } finally {
        this.loading = false
      }
    },
    selectMember(member) {
      this.currentMemberId = member.plantel_id
      this.currentMember = member
    },
    getRolTagType(rol) {
      const types = {
        ENTRENADOR: 'success',
        ASISTENTE: 'info',
        PREPARADOR_FISICO: '',
        MEDICO: 'warning',
        ADMINISTRATIVO: 'danger'
      }
      return types[rol] || ''
    },
    handleCreate() {
      this.isEdit = false
      this.editingId = null
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.editingId = row.plantel_id
      this.formData = {
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: row.telefono || '',
        rol: row.rol
      }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.plantelForm.validate()
        this.submitting = true

        if (this.isEdit) {
          await updatePlantel(this.editingId, this.formData)
          this.$message.success('Miembro actualizado exitosamente')
        } else {
          await createPlantel(this.formData)
          this.$message.success('Miembro creado exitosamente')
        }

        this.dialogVisible = false
        await this.fetchPlantel()

        // Si estábamos editando, actualizar el miembro actual
        if (this.isEdit && this.currentMemberId === this.editingId) {
          const updated = this.plantelList.find(
            (p) => p.plantel_id === this.editingId
          )
          if (updated) this.currentMember = updated
        }
      } catch (error) {
        if (error !== false) {
          console.error('Error guardando miembro:', error)
          this.$message.error('Error al guardar el miembro')
        }
      } finally {
        this.submitting = false
      }
    },
    handleDelete(row) {
      this.$confirm(
        `¿Está seguro de eliminar a ${row.nombre} ${row.apellido}?`,
        'Confirmar eliminación',
        {
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            await deletePlantel(row.plantel_id)
            this.$message.success('Miembro eliminado exitosamente')
            this.currentMemberId = null
            this.fetchPlantel()
          } catch (error) {
            console.error('Error eliminando miembro:', error)
            const errorMsg =
              error.response?.data?.error || 'Error al eliminar el miembro'
            this.$message.error(errorMsg)
          }
        })
        .catch(() => {})
    },
    resetForm() {
      this.formData = {
        nombre: '',
        apellido: '',
        telefono: '',
        rol: ''
      }
      if (this.$refs.plantelForm) {
        this.$refs.plantelForm.resetFields()
      }
    }
  }
}
</script>

<style scoped>
.plantel-container {
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #7B2D3A, #7B2D3A);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(229, 29, 34, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 5px 0;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.main-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 15px;
}

/* Sidebar Styles */
.sidebar .el-card {
  height: calc(100vh - 200px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar ::v-deep .el-card__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

/* Estilos prominentes para el campo de búsqueda */
.search-container ::v-deep .el-input__inner {
  background-color: #ffffff !important;
  border: 2px solid #94a3b8 !important;
  border-radius: 8px;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 10px 15px 10px 40px;
  height: auto;
  line-height: 1.5;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.search-container ::v-deep .el-input__inner:hover {
  border-color: #64748b !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-container ::v-deep .el-input__inner:focus {
  border-color: #7B2D3A !important;
  box-shadow: 0 0 0 3px rgba(229, 29, 34, 0.15);
}

.search-container ::v-deep .el-input__inner::placeholder {
  color: #64748b !important;
  font-weight: 500;
}

.search-container ::v-deep .el-input__prefix {
  left: 12px;
  color: #7B2D3A !important;
  font-size: 1.1rem;
}

/* Estilos para filtros en popover */
.filter-item ::v-deep .el-input__inner,
.filter-item ::v-deep .el-select .el-input__inner {
  background-color: #ffffff !important;
  border: 2px solid #94a3b8 !important;
  border-radius: 8px;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
}

.filter-item ::v-deep .el-input__inner:focus,
.filter-item ::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #7B2D3A !important;
  box-shadow: 0 0 0 3px rgba(229, 29, 34, 0.15);
}

.filter-item ::v-deep .el-select .el-input .el-select__caret {
  color: #7B2D3A !important;
}

.member-list {
  overflow-y: auto;
  flex: 1;
}

.member-item {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 15px;
}

.member-item:hover {
  background-color: #f5f7fa;
}

.member-item.active {
  background-color: #fee;
  border-left: 4px solid #7B2D3A;
}

.member-photo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #7B2D3A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  overflow: hidden;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-info h3 {
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-weight: 600;
}

.member-info p {
  font-size: 0.8rem;
  color: #64748b;
  margin: 2px 0;
}

.empty-state-list {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 0.9rem;
}

/* Content Area Styles */
.content-area {
  min-height: 500px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state h3 {
  margin-top: 20px;
  color: #303133;
}

/* Member Details Styles */
.member-details-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.member-details-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #7B2D3A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.member-details-info {
  flex: 1;
}

.member-details-info h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.member-actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

.form-item label {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

/* Estilos del popover de filtros (IDÉNTICO a atletas) */
.filter-popover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #7B2D3A;
  border-radius: 12px;
  padding: 15px;
  margin: -12px;
  box-shadow: 0 4px 15px rgba(123, 45, 58, 0.2);
}

.filter-popover h4 {
  margin: 0 0 15px 0;
  font-size: 1rem;
  color: #7B2D3A;
  font-weight: 700;
  border-bottom: 2px solid #7B2D3A;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item {
  margin-bottom: 15px;
}

.filter-item label {
  display: block;
  font-size: 0.85rem;
  color: #7B2D3A;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos prominentes para campos de filtro */
.filter-item ::v-deep .el-input__inner,
.filter-item ::v-deep .el-select .el-input__inner {
  background-color: #ffffff !important;
  border: 2px solid #7B2D3A !important;
  border-radius: 8px;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 12px;
  height: auto;
  transition: all 0.3s ease;
}

.filter-item ::v-deep .el-input__inner:focus,
.filter-item ::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #60232d !important;
  box-shadow: 0 0 0 3px rgba(123, 45, 58, 0.25);
}

.filter-item ::v-deep .el-select .el-input .el-select__caret {
  color: #7B2D3A !important;
}

.filter-btn {
  font-size: 1.4rem !important;
  color: #7B2D3A !important;
  padding: 6px 10px !important;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  border: 2px solid #7B2D3A !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.filter-btn:hover {
  color: #ffffff !important;
  background: linear-gradient(135deg, #7B2D3A 0%, #60232d 100%) !important;
  border-color: #60232d !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(123, 45, 58, 0.35);
}

/* Estilos para el dropdown de Element UI (IDÉNTICO a atletas) */
::v-deep .el-select-dropdown__item {
  padding: 10px 20px;
  height: auto;
  line-height: 1.5;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  margin: 0;
}

::v-deep .el-select-dropdown__item.hover,
::v-deep .el-select-dropdown__item:hover {
  background-color: #fef2f2;
  color: #7B2D3A;
  font-weight: 600;
}

::v-deep .el-select-dropdown__item.selected {
  background-color: #7B2D3A;
  color: white;
  font-weight: 700;
}

::v-deep .el-select-dropdown__list {
  padding: 5px 0;
}

::v-deep .el-button--primary {
  background-color: #7B2D3A;
  border-color: #7B2D3A;
}

::v-deep .el-button--primary:hover,
::v-deep .el-button--primary:focus {
  background-color: #7B2D3A;
  border-color: #7B2D3A;
}

::v-deep .el-tabs__item.is-active {
  color: #7B2D3A;
}

::v-deep .el-tabs__active-bar {
  background-color: #7B2D3A;
}

::v-deep .el-tabs__item:hover {
  color: #7B2D3A;
}

/* Header Action Button - Card-like framed style (IDENTICAL to atletas) */
.header-action-btn {
  background-color: #ffffff !important;
  color: #7B2D3A !important;
  border: 2px solid #94a3b8 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  padding: 10px 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header-action-btn:hover {
  transform: translateY(-3px);
  border-color: #7B2D3A !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  background-color: #fef2f2 !important;
}
</style>
