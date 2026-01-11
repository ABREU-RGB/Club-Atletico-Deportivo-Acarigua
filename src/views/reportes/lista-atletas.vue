<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px; font-weight: bold;">
          <i class="el-icon-files" /> Lista de Atletas
        </span>
      </div>

      <div class="placeholder-content">
        <el-empty description="Módulo en desarrollo">
          <template slot="image">
            <i class="el-icon-user" style="font-size: 100px; color: #909399;" />
          </template>
          <p style="color: #909399; margin-top: 20px;">
            Este módulo permitirá generar listas de atletas con diferentes filtros.
          </p>
          <p style="color: #909399;">
            Características próximas:
          </p>
          <ul style="color: #909399; text-align: left; display: inline-block;">
            <li>Lista de todos los atletas</li>
            <li>Filtrar por categoría</li>
            <li>Filtrar por estatus (Activo, Inactivo, Lesionado)</li>
            <li>Información detallada de cada atleta</li>
            <li>Exportación a PDF/Excel</li>
          </ul>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ListaAtletas',
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
