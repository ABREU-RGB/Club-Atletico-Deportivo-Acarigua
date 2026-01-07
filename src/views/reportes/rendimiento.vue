<template>
  <div class="progress-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1><i class="el-icon-data-line" /> Análisis de Progreso</h1>
          <p class="subtitle">Evolución y Rendimiento del Atleta</p>
        </div>
        <div class="header-filters">
          <el-select
            v-model="selectedAtletaId"
            filterable
            placeholder="Seleccionar Atleta"
            @change="handleAtletaChange"
          >
            <el-option
              v-for="item in atletas"
              :key="item.atleta_id"
              :label="item.nombre + ' ' + item.apellido"
              :value="item.atleta_id"
            />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <el-card v-if="!selectedAtletaId" class="empty-card">
      <div class="empty-state">
        <i class="el-icon-user" />
        <h3>Selecciona un atleta para ver su progreso</h3>
        <p>Utiliza el selector de la esquina superior derecha para comenzar el análisis.</p>
      </div>
    </el-card>

    <div v-else v-loading="loading">
      <!-- Athlete Profile Mini Card -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover" class="athlete-summary-card">
            <div class="summary-content">
              <div class="athlete-avatar">
                <img v-if="atleta.foto" :src="getFotoUrl(atleta.foto)" class="avatar-img">
                <i v-else class="el-icon-user" />
              </div>
              <div class="athlete-details">
                <h2>{{ atleta.nombre }} {{ atleta.apellido }}</h2>
                <div class="tags">
                  <el-tag size="small" type="danger">{{ atleta.categoria_nombre }}</el-tag>
                  <el-tag size="small" type="info">{{ atleta.posicion_de_juego || 'Sin posición' }}</el-tag>
                  <el-tag size="small" type="success">Pierna: {{ atleta.pierna_dominante || 'Derecha' }}</el-tag>
                </div>
              </div>
              <div class="quick-stats">
                <div class="stat-mini">
                  <span class="label">Peso Actual</span>
                  <span class="value">{{ latestMedicion ? latestMedicion.peso + ' kg' : '-' }}</span>
                </div>
                <div class="stat-mini">
                  <span class="label">IMC</span>
                  <span class="value">{{ latestMedicion ? latestMedicion.indice_de_masa : '-' }}</span>
                </div>
                <div class="stat-mini">
                  <span class="label">Tests</span>
                  <span class="value">{{ tests.length }} realizados</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Trends Row -->
      <el-row :gutter="20" class="stat-cards">
        <el-col v-for="trend in trends" :key="trend.label" :span="6">
          <el-card shadow="hover" class="trend-card">
            <div class="trend-label">{{ trend.label }}</div>
            <div class="trend-value">{{ trend.value }}{{ trend.unit }}</div>
            <div :class="['trend-percentage', trend.status]">
              <i :class="trend.status === 'up' ? 'el-icon-top' : 'el-icon-bottom'" />
              {{ trend.diff > 0 ? '+' : '' }}{{ trend.diff }}%
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Charts Grid -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card shadow="hover" class="chart-card">
            <div slot="header">
              <span><i class="el-icon-line-chart" /> Evolución de Rendimiento</span>
            </div>
            <div id="performance-chart" style="height: 400px;" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <div slot="header">
              <span><i class="el-icon-aim" /> Perfil Competitivo (Radar)</span>
            </div>
            <div id="radar-chart" style="height: 400px;" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card shadow="hover" class="chart-card">
            <div slot="header">
              <span><i class="el-icon-receiving" /> Histórico de Medidas Corporales</span>
            </div>
            <div id="anthropometric-chart" style="height: 350px;" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import * as echarts from 'echarts'

export default {
  name: 'RendimientoGeneral',
  data() {
    return {
      selectedAtletaId: null,
      atletas: [],
      atleta: {},
      tests: [],
      mediciones: [],
      loading: false,
      backendUrl: 'http://localhost:3000',
      charts: {
        performance: null,
        radar: null,
        anthropometric: null
      }
    }
  },
  computed: {
    latestMedicion() {
      return this.mediciones.length > 0 ? this.mediciones[0] : null
    },
    trends() {
      if (this.tests.length < 2) return []
      const first = this.tests[this.tests.length - 1]
      const latest = this.tests[0]

      const calculate = (val1, val2) => {
        if (!val1) return 0
        return (((val2 - val1) / val1) * 100).toFixed(1)
      }

      return [
        { label: 'Fuerza', value: latest.test_de_fuerza, unit: '', diff: calculate(first.test_de_fuerza, latest.test_de_fuerza), status: (latest.test_de_fuerza >= first.test_de_fuerza ? 'up' : 'down') },
        { label: 'Velocidad', value: latest.test_velocidad, unit: '', diff: calculate(first.test_velocidad, latest.test_velocidad), status: (latest.test_velocidad >= first.test_velocidad ? 'up' : 'down') },
        { label: 'Resistencia', value: latest.test_resistencia, unit: '', diff: calculate(first.test_resistencia, latest.test_resistencia), status: (latest.test_resistencia >= first.test_resistencia ? 'up' : 'down') },
        { label: 'Coordinación', value: latest.test_coordinacion, unit: '', diff: calculate(first.test_coordinacion, latest.test_coordinacion), status: (latest.test_coordinacion >= first.test_coordinacion ? 'up' : 'down') }
      ]
    }
  },
  async created() {
    await this.loadAtletas()
    const queryId = this.$route.query.atleta_id
    if (queryId) {
      this.selectedAtletaId = parseInt(queryId)
      this.handleAtletaChange(this.selectedAtletaId)
    }
  },
  beforeDestroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.dispose()
    })
  },
  methods: {
    async loadAtletas() {
      try {
        const response = await request({ url: '/atletas', method: 'get' })
        this.atletas = response || []
      } catch (error) {
        console.error('Error cargando atletas:', error)
      }
    },
    async handleAtletaChange(id) {
      this.loading = true
      this.atleta = this.atletas.find(a => a.atleta_id === id) || {}
      try {
        const [tests, mediciones] = await Promise.all([
          request({ url: `/tests?atleta_id=${id}`, method: 'get' }),
          request({ url: `/mediciones?atleta_id=${id}`, method: 'get' })
        ])
        this.tests = tests || []
        this.mediciones = mediciones || []

        this.$nextTick(() => {
          this.initCharts()
        })
      } catch (error) {
        this.$message.error('Error cargando datos del atleta')
      } finally {
        this.loading = false
      }
    },
    getFotoUrl(filename) {
      return `${this.backendUrl}/uploads/atletas/${filename}`
    },
    initCharts() {
      this.initPerformanceChart()
      this.initRadarChart()
      this.initAnthropometricChart()
    },
    initPerformanceChart() {
      const chartDom = document.getElementById('performance-chart')
      if (!chartDom) return
      this.charts.performance = echarts.init(chartDom)

      const revertedTests = [...this.tests].reverse()
      const dates = revertedTests.map(t => {
        const d = new Date(t.fecha_test)
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
      })

      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Fuerza', 'Velocidad', 'Resistencia', 'Coordinación'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: dates },
        yAxis: { type: 'value' },
        series: [
          { name: 'Fuerza', type: 'line', smooth: true, data: revertedTests.map(t => t.test_de_fuerza) },
          { name: 'Velocidad', type: 'line', smooth: true, data: revertedTests.map(t => t.test_velocidad) },
          { name: 'Resistencia', type: 'line', smooth: true, data: revertedTests.map(t => t.test_resistencia) },
          { name: 'Coordinación', type: 'line', smooth: true, data: revertedTests.map(t => t.test_coordinacion) }
        ],
        color: ['#E51D22', '#2a5a8c', '#4CAF50', '#f39c12']
      }
      this.charts.performance.setOption(option)
    },
    initRadarChart() {
      const chartDom = document.getElementById('radar-chart')
      if (!chartDom) return
      this.charts.radar = echarts.init(chartDom)

      if (this.tests.length === 0) return

      const latest = this.tests[0]
      const option = {
        radar: {
          indicator: [
            { name: 'Fuerza', max: 100 },
            { name: 'Velocidad', max: 100 },
            { name: 'Resistencia', max: 100 },
            { name: 'Coordinación', max: 100 },
            { name: 'Reacción', max: 100 }
          ],
          splitArea: { show: false }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [
              latest.test_de_fuerza,
              latest.test_velocidad,
              latest.test_resistencia,
              latest.test_coordinacion,
              latest.test_de_reaccion
            ],
            name: 'Estado Actual',
            areaStyle: { color: 'rgba(229, 29, 34, 0.3)' },
            itemStyle: { color: '#E51D22' }
          }]
        }]
      }
      this.charts.radar.setOption(option)
    },
    initAnthropometricChart() {
      const chartDom = document.getElementById('anthropometric-chart')
      if (!chartDom) return
      this.charts.anthropometric = echarts.init(chartDom)

      const revertedMediciones = [...this.mediciones].reverse()
      const dates = revertedMediciones.map(m => {
        const d = new Date(m.fecha_medicion)
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
      })

      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Peso (kg)', 'Altura (cm)', 'IMC'] },
        xAxis: { type: 'category', data: dates },
        yAxis: [
          { type: 'value', name: 'Kg/Cm' },
          { type: 'value', name: 'IMC', position: 'right' }
        ],
        series: [
          { name: 'Peso (kg)', type: 'bar', data: revertedMediciones.map(m => m.peso) },
          { name: 'Altura (cm)', type: 'line', data: revertedMediciones.map(m => m.altura) },
          { name: 'IMC', type: 'line', yAxisIndex: 1, data: revertedMediciones.map(m => m.indice_de_masa) }
        ],
        color: ['#ff8c00', '#2a5a8c', '#4CAF50']
      }
      this.charts.anthropometric.setOption(option)
    }
  }
}
</script>

<style scoped>
.progress-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #1a3a5f, #2a5a8c);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(26, 58, 95, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.subtitle {
  opacity: 0.8;
  margin: 5px 0 0;
}

.empty-card {
  padding: 80px 20px;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
}

.athlete-summary-card {
  margin-bottom: 20px;
  border-left: 5px solid #E51D22;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.athlete-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.athlete-details h2 {
  margin: 0 0 8px 0;
  font-size: 1.4rem;
}

.tags {
  display: flex;
  gap: 8px;
}

.quick-stats {
  margin-left: auto;
  display: flex;
  gap: 30px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
}

.stat-mini .label {
  font-size: 0.85rem;
  color: #64748b;
}

.stat-mini .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-cards {
  margin-bottom: 20px;
}

.trend-card {
  text-align: center;
  padding: 10px;
}

.trend-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 5px;
}

.trend-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

.trend-percentage {
  font-weight: 600;
  font-size: 0.9rem;
}

.trend-percentage.up {
  color: #10b981;
}

.trend-percentage.down {
  color: #ef4444;
}

.chart-card {
  border-radius: 12px;
}

.chart-card [slot="header"] {
  font-weight: 600;
  color: #1e293b;
}
</style>
