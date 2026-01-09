<template>
  <div class="plantel-container">
    <!-- Header -->
    <div class="page-header">
      <h2><i class="el-icon-user-solid" /> Gestión del Plantel</h2>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">
        Nuevo Miembro
      </el-button>
    </div>

    <!-- Filtros -->
    <div class="filter-container">
      <el-select
        v-model="filterRol"
        placeholder="Filtrar por Rol"
        clearable
        @change="fetchPlantel"
      >
        <el-option
          v-for="rol in rolesOptions"
          :key="rol.value"
          :label="rol.label"
          :value="rol.value"
        />
      </el-select>
      <el-button
        icon="el-icon-refresh"
        circle
        @click="handleRefresh"
      />
    </div>

    <!-- Tabla -->
    <el-table
      v-loading="loading"
      :data="plantelList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="plantel_id" label="ID" width="70" align="center" />
      <el-table-column prop="nombre" label="Nombre" min-width="120" />
      <el-table-column prop="apellido" label="Apellido" min-width="120" />
      <el-table-column prop="telefono" label="Teléfono" width="120" />
      <el-table-column prop="rol" label="Rol" width="150">
        <template slot-scope="scope">
          <el-tag :type="getRolTagType(scope.row.rol)">
            {{ scope.row.rol }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Acciones" width="300" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            Editar
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Empty State -->
    <div v-if="!loading && plantelList.length === 0" class="empty-state">
      <i class="el-icon-user-solid" />
      <p>No hay miembros en el plantel</p>
      <el-button type="primary" @click="handleCreate">Agregar primer miembro</el-button>
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
      >
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="formData.nombre" placeholder="Ingrese nombre" />
        </el-form-item>
        <el-form-item label="Apellido" prop="apellido">
          <el-input v-model="formData.apellido" placeholder="Ingrese apellido" />
        </el-form-item>
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
        <el-form-item label="Rol" prop="rol">
          <el-select v-model="formData.rol" placeholder="Seleccione rol" style="width: 100%">
            <el-option
              v-for="rol in rolesOptions"
              :key="rol.value"
              :label="rol.label"
              :value="rol.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPlantel, createPlantel, updatePlantel, deletePlantel } from '@/api/plantel'

export default {
  name: 'ListaPlantel',
  data() {
    return {
      loading: false,
      submitting: false,
      plantelList: [],
      filterRol: '',
      dialogVisible: false,
      isEdit: false,
      editingId: null,
      formData: {
        nombre: '',
        apellido: '',
        telefono: '',
        rol: ''
      },
      formRules: {
        nombre: [
          { required: true, message: 'El nombre es obligatorio', trigger: 'blur' }
        ],
        apellido: [
          { required: true, message: 'El apellido es obligatorio', trigger: 'blur' }
        ],
        telefono: [
          { pattern: /^[0-9]*$/, message: 'Solo se permiten números', trigger: 'blur' }
        ],
        rol: [
          { required: true, message: 'Seleccione un rol', trigger: 'change' }
        ]
      },
      rolesOptions: [
        { value: 'ENTRENADOR', label: 'Entrenador' },
        { value: 'AUXILIAR', label: 'Auxiliar' },
        { value: 'MEDICO', label: 'Médico' },
        { value: 'DIRECTIVO', label: 'Directivo' },
        { value: 'ADMINISTRATIVO', label: 'Administrativo' }
      ]
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
        this.plantelList = response.data || response
      } catch (error) {
        console.error('Error cargando plantel:', error)
        this.$message.error('Error al cargar el plantel')
      } finally {
        this.loading = false
      }
    },
    handleRefresh() {
      this.filterRol = ''
      this.fetchPlantel()
    },
    getRolTagType(rol) {
      const types = {
        'ENTRENADOR': 'success',
        'AUXILIAR': 'info',
        'MEDICO': 'warning',
        'DIRECTIVO': 'danger',
        'ADMINISTRATIVO': ''
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
        this.fetchPlantel()
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
      ).then(async() => {
        try {
          await deletePlantel(row.plantel_id)
          this.$message.success('Miembro eliminado exitosamente')
          this.fetchPlantel()
        } catch (error) {
          console.error('Error eliminando miembro:', error)
          const errorMsg = error.response?.data?.error || 'Error al eliminar el miembro'
          this.$message.error(errorMsg)
        }
      }).catch(() => {})
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
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-header h2 {
  margin: 0;
  color: #303133;
  font-size: 22px;
}

.page-header h2 i {
  margin-right: 10px;
  color: #409eff;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-container .el-select {
  width: 200px;
}

/* Encabezados de tabla en color negro */
.plantel-container .el-table th {
  color: #000000 !important;
  font-weight: 600;
  background-color: #000000 !important;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plantel-container .el-table th .cell {
  color: #000000 !important;
  font-weight: 600;
  padding: 16px 12px !important;
}

/* Estilos elegantes para la tabla */
.plantel-container .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px #000000;
  border: none !important;
}

.plantel-container .el-table td .cell {
  padding: 14px 12px !important;
}

.plantel-container .el-table td,
.plantel-container .el-table th {
  border-bottom: 1px solid #000000 !important;
  border-right: none !important;
}

/* Separadores verticales sutiles entre columnas */
.plantel-container .el-table--border td,
.plantel-container .el-table--border th {
  border-right: 1px solid #000000 !important;
}

/* Efecto hover en filas */
.plantel-container .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #000000 !important;
}

/* Filas alternas con color sutil */
.plantel-container .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #000000 !important;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #dcdfe6;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

/* Placeholders más visibles */
.plantel-container ::placeholder {
  color: #303133 !important;
  opacity: 0.8;
}

.plantel-container ::-webkit-input-placeholder {
  color: #303133 !important;
  opacity: 0.8;
}

.plantel-container ::-moz-placeholder {
  color: #303133 !important;
  opacity: 0.8;
}

.plantel-container :-ms-input-placeholder {
  color: #303133 !important;
  opacity: 0.8;
}

.plantel-container .el-input__inner::placeholder {
  color: #303133 !important;
  opacity: 0.8;
}

/* Bordes de los campos de entrada en negro */
.plantel-container .el-input__inner {
  border: 1.5px solid #000000 !important;
}

.plantel-container .el-input__inner:focus {
  border-color: #409eff !important;
}

.plantel-container .el-select .el-input__inner {
  border: 1.5px solid #000000 !important;
}

.plantel-container .el-select .el-input.is-focus .el-input__inner {
  border-color: #409eff !important;
}
</style>
