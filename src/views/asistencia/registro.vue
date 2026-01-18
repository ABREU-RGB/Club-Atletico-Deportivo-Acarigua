<template>
  <div class="asistencia-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1><i class="el-icon-date" /> Control de Asistencia</h1>
          <p class="subtitle">Registro diario por categoría</p>
        </div>
        <div class="header-actions">
          <el-date-picker
            v-model="fecha"
            type="date"
            placeholder="Seleccionar Fecha"
            value-format="yyyy-MM-dd"
            :clearable="false"
            class="header-date-picker"
            @change="loadData"
          />
        </div>
      </div>
    </div>

    <!-- Controls & Filters -->
    <el-card shadow="hover" class="control-card">
      <div class="control-row">
        <div class="control-item category-select">
          <label>Categoría</label>
          <el-select
            v-model="categoria_id"
            placeholder="Seleccionar Categoría"
            filterable
            @change="loadData"
          >
            <el-option
              v-for="cat in categorias"
              :key="cat.categoria_id"
              :label="cat.nombre_categoria"
              :value="cat.categoria_id"
            />
          </el-select>
        </div>

        <div class="control-item category-select">
          <label>Entrenador Resp.</label>
          <el-select
            v-model="entrenador_id"
            placeholder="Responsable"
            filterable
          >
            <el-option
              v-for="entr in entrenadores"
              :key="entr.plantel_id"
              :label="entr.nombre + ' ' + entr.apellido"
              :value="entr.plantel_id"
            />
          </el-select>
        </div>

        <div class="control-item event-select">
          <label>Tipo de Evento</label>
          <el-select v-model="tipo_evento" placeholder="Tipo">
            <el-option label="Entrenamiento" value="ENTRENAMIENTO" />
            <el-option label="Partido" value="PARTIDO" />
            <el-option label="Evento Especial" value="EVENTO_ESPECIAL" />
          </el-select>
        </div>

        <div class="control-item search-box">
          <label>Buscar Atleta</label>
          <el-input
            v-model="searchQuery"
            placeholder="Nombre..."
            prefix-icon="el-icon-search"
            clearable
          />
        </div>

        <div class="control-item actions">
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="saving"
            :disabled="!categoria_id || listaAtletas.length === 0"
            @click="performSave"
          >
            Guardar Asistencia
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Main Table -->
    <el-card shadow="hover" class="main-card">
      <div v-if="loading" class="loading-state">
        <i class="el-icon-loading" /> Cargando atletas...
      </div>

      <div v-else-if="!categoria_id" class="empty-state">
        <i class="el-icon-s-order" />
        <p>Seleccione una categoría para comenzar el registro</p>
      </div>

      <div v-else>
        <!-- Bulk Actions -->
        <div class="bulk-actions">
          <el-button-group>
            <el-button size="mini" type="success" plain @click="setAllStatus('PRESENTE')">Todos Presentes</el-button>
            <el-button size="mini" type="danger" plain @click="setAllStatus('AUSENTE')">Todos Ausentes</el-button>
          </el-button-group>
          <span class="summary-text">
            Total: {{ filteredAtletas.length }} |
            Presentes: {{ countPresentes }}
          </span>
        </div>

        <el-table
          :data="filteredAtletas"
          style="width: 100%"
          border
          row-key="atleta_id"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="Atleta" min-width="250">
            <template slot-scope="scope">
              <div class="athlete-cell">
                <div class="athlete-photo">
                  <div v-if="scope.row.foto" class="avatar-img-wrapper">
                    <img :src="getFotoUrl(scope.row.foto)" class="avatar-img">
                  </div>
                  <i v-else class="el-icon-user" />
                </div>
                <div class="athlete-info">
                  <span class="name">{{ scope.row.nombre }} {{ scope.row.apellido }}</span>
                  <span v-if="scope.row.cedula" class="cedula">#{{ scope.row.cedula }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Asistencia" min-width="320" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.status" size="small" class="status-group" @change="scope.row.isSaved = false">
                <el-radio-button label="PRESENTE">
                  <i class="el-icon-check" /> Presente
                </el-radio-button>
                <el-radio-button label="AUSENTE">
                  <i class="el-icon-close" /> Ausente
                </el-radio-button>
                <el-radio-button label="JUSTIFICADO">
                  <i class="el-icon-warning-outline" /> Justif.
                </el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column label="Observaciones" min-width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.observaciones"
                size="small"
                placeholder="Nota opcional..."
                @input="scope.row.isSaved = false"
              />
            </template>
          </el-table-column>

          <el-table-column label="Estado" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSaved" type="success" size="mini" effect="dark"><i class="el-icon-check" /> Guardado</el-tag>
              <el-tag v-else type="info" size="mini" effect="plain">Pendiente</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategorias } from '@/api/categorias'
import { getAtletas } from '@/api/atletas'
import { getAsistencias, createAsistencia, updateAsistencia } from '@/api/asistencias'
import { getPlantel } from '@/api/plantel'

export default {
  name: 'RegistroAsistenciaBulk',
  data() {
    return {
      loading: false,
      saving: false,
      categorias: [],
      entrenadores: [],
      categoria_id: '',
      entrenador_id: '',
      fecha: '',
      tipo_evento: 'ENTRENAMIENTO',
      listaAtletas: [],
      searchQuery: '',
      backendUrl: 'http://localhost:3000'
    }
  },
  computed: {
    filteredAtletas() {
      if (!this.searchQuery) return this.listaAtletas
      const q = this.searchQuery.toLowerCase()
      return this.listaAtletas.filter(a =>
        a.nombre.toLowerCase().includes(q) ||
        a.apellido.toLowerCase().includes(q)
      )
    },
    countPresentes() {
      return this.listaAtletas.filter(a => a.status === 'PRESENTE').length
    }
  },
  created() {
    this.fecha = this.getTodayDate()
    this.fetchCategorias()
    this.fetchEntrenadores()
  },
  methods: {
    getTodayDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async fetchCategorias() {
      try {
        this.categorias = await getCategorias()
      } catch (error) {
        this.$message.error('Error cargando categorías')
      }
    },
    async fetchEntrenadores() {
      try {
        this.entrenadores = await getPlantel({ rol: 'ENTRENADOR' })
        if (this.entrenadores.length > 0) {
          this.entrenador_id = this.entrenadores[0].plantel_id
        }
      } catch (error) {
        console.error(error)
      }
    },
    async loadData() {
      if (!this.categoria_id) return

      this.loading = true
      this.listaAtletas = []

      try {
        const allAtletas = await getAtletas()
        const atletasCategoria = allAtletas.filter(a => a.categoria_id === this.categoria_id)

        const asistencias = await getAsistencias({
          categoria_id: this.categoria_id,
          fecha: this.fecha
        })

        this.listaAtletas = atletasCategoria.map(atleta => {
          // Check match
          const record = asistencias.find(r =>
            r.atleta_id === atleta.atleta_id &&
             r.fecha.includes(this.fecha)
          )

          return {
            ...atleta,
            status: record ? record.estatus : 'PRESENTE',
            observaciones: record ? record.observaciones : '',
            asistencia_id: record ? record.asistencia_id : null,
            isSaved: !!record
          }
        })

        this.listaAtletas.sort((a, b) => a.nombre.localeCompare(b.nombre))
      } catch (error) {
        console.error(error)
        this.$message.error('Error cargando datos')
      } finally {
        this.loading = false
      }
    },
    setAllStatus(status) {
      this.listaAtletas.forEach(a => {
        a.status = status
        a.isSaved = false
      })
    },
    async performSave() {
      if (!this.entrenador_id) {
        this.$message.warning('Seleccione un entrenador responsable')
        return
      }

      this.saving = true
      let errors = 0

      // Use sequential loop to avoid 'require-atomic-updates' lint error
      for (const atleta of this.listaAtletas) {
        if (atleta.isSaved) continue

        const payload = {
          atleta_id: atleta.atleta_id,
          categoria_id: this.categoria_id,
          fecha: this.fecha,
          tipo_evento: this.tipo_evento,
          estatus: atleta.status,
          observaciones: atleta.observaciones,
          entrenador_id: this.entrenador_id
        }

        try {
          if (atleta.asistencia_id) {
            await updateAsistencia(atleta.asistencia_id, payload)
          } else {
            const res = await createAsistencia(payload)
            // API create returns { message, id }
            if (res && res.id) {
              atleta.asistencia_id = res.id
            }
          }
          atleta.isSaved = true
        } catch (e) {
          console.error('Error saving athlete ' + atleta.atleta_id, e)
          errors++
        }
      }

      this.saving = false
      if (errors > 0) {
        this.$message.warning(`Guardado con ${errors} errores.`)
      } else {
        this.$message.success('Asistencia actualizada correctamente')
      }
    },
    getFotoUrl(filename) {
      if (!filename) return ''
      if (filename.startsWith('/uploads')) {
        return `${this.backendUrl}${filename}`
      }
      return `${this.backendUrl}/uploads/atletas/${filename}`
    },
    tableRowClassName({ row }) {
      if (row.status === 'AUSENTE') return 'row-ausente'
      if (row.status === 'JUSTIFICADO') return 'row-justificado'
      return ''
    }
  }
}
</script>

<style scoped>
.asistencia-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.page-header {
  background: linear-gradient(135deg, #7B2D3A, #7B2D3A);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 1.5rem;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.subtitle {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

/* Controls */
.control-card {
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.control-item {
  flex: 1;
  min-width: 200px;
}

.control-item.actions {
  flex: 0 0 auto;
  min-width: auto;
}

.control-item label {
  display: block;
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos prominentes para todos los campos del formulario */
.control-item ::v-deep .el-input__inner,
.control-item ::v-deep .el-select .el-input__inner {
  background-color: #ffffff !important;
  border: 2px solid #94a3b8 !important;
  border-radius: 8px;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 12px 15px;
  height: auto;
  line-height: 1.5;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.control-item ::v-deep .el-input__inner:hover,
.control-item ::v-deep .el-select .el-input__inner:hover {
  border-color: #64748b !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.control-item ::v-deep .el-input__inner:focus,
.control-item ::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #7B2D3A !important;
  box-shadow: 0 0 0 3px rgba(229, 29, 34, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Placeholder más visible */
.control-item ::v-deep .el-input__inner::placeholder {
  color: #64748b !important;
  font-weight: 500;
}

/* Icono de búsqueda más visible */
.control-item.search-box ::v-deep .el-input__prefix {
  left: 12px;
  color: #7B2D3A !important;
  font-size: 1.1rem;
}

.control-item.search-box ::v-deep .el-input__inner {
  padding-left: 40px;
}

/* Icono de flecha del select más visible */
.control-item ::v-deep .el-select .el-input .el-select__caret {
  color: #7B2D3A !important;
  font-size: 1rem;
  font-weight: bold;
}

/* Main Table */
.main-card {
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.bulk-actions {
  padding: 0 0 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 15px;
}

.summary-text {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

/* Athlete Cell */
.athlete-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.athlete-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
}

.avatar-img-wrapper {
  width: 100%;
  height: 100%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.athlete-info {
  display: flex;
  flex-direction: column;
}

.athlete-info .name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.athlete-info .cedula {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Status Radio */
.status-group ::v-deep .el-radio-button__inner {
  padding: 8px 15px;
  font-size: 13px;
}

.status-group ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #7B2D3A;
  border-color: #7B2D3A;
  box-shadow: -1px 0 0 0 #7B2D3A;
}

/* Custom Overrides */
::v-deep .el-button--primary {
  background-color: #7B2D3A;
  border-color: #7B2D3A;
}

::v-deep .el-button--primary:hover {
  background-color: #cf1a1e;
  border-color: #cf1a1e;
}

::v-deep .row-ausente {
  background-color: #fef2f2 !important;
}

::v-deep .row-justificado {
  background-color: #fffbeb !important;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #94a3b8;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* Header Date Picker - Más visible y prominente */
.header-date-picker ::v-deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border: 2px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px;
  color: #1e293b !important;
  font-weight: 600;
  font-size: 1rem;
  padding: 10px 15px 10px 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-date-picker ::v-deep .el-input__inner:hover {
  background-color: #ffffff !important;
  border-color: #ffffff !important;
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.25);
}

.header-date-picker ::v-deep .el-input__inner:focus {
  background-color: #ffffff !important;
  border-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4), 0 6px 12px -2px rgba(0, 0, 0, 0.25);
}

/* Icono del calendario más visible */
.header-date-picker ::v-deep .el-input__prefix {
  left: 10px;
  color: #7B2D3A !important;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
}

.header-date-picker ::v-deep .el-input__prefix i {
  color: #7B2D3A !important;
  font-size: 1.3rem;
  font-weight: bold;
}

/* Ajustar el tamaño del input */
.header-date-picker ::v-deep .el-input {
  width: 180px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 15px;
    margin-bottom: 15px;
  }

  .control-row {
    flex-direction: column;
    gap: 15px;
  }

  .control-item {
    width: 100%;
    min-width: 0;
  }
}
</style>
