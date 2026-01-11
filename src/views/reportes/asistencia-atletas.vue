<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px; font-weight: bold;">
          <i class="el-icon-date" /> Asistencia de Atletas
        </span>
      </div>

      <div class="placeholder-content">
        <el-empty description="Módulo en desarrollo">
          <template slot="image">
            <i class="el-icon-document-checked" style="font-size: 100px; color: #909399;" />
          </template>
          <p style="color: #909399; margin-top: 20px;">
            Este módulo permitirá generar reportes de asistencia de los atletas.
          </p>
          <p style="color: #909399;">
            Características próximas:
          </p>
          <ul style="color: #909399; text-align: left; display: inline-block;">
            <li>Reporte de asistencia por atleta</li>
            <li>Reporte de asistencia por categoría</li>
            <li>Estadísticas de asistencia mensual</li>
            <li>Exportación de datos</li>
          </ul>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AsistenciaAtletas',
  data() {
    return {}
  }
}
</script>

<style scoped>
.placeholder-content {
  padding: 40px;
  text-align: center;
}

.box-card {
  min-height: 500px;
}
</style>
