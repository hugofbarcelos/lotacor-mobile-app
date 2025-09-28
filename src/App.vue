<template>
  <div style="padding: 16px">
    <button @click="callApi" style="margin-bottom: 20px">Atualizar Dados</button>
    <v-chart 
      v-if="lineOption.series.length" 
      :option="lineOption" 
      autoresize
      style="width: 100%; max-width: 400px; height: 320px; margin: auto;"/>
    <pre v-else>{{ apiResponse }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { use } from 'echarts/core';
import VChart from 'vue-echarts';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

const apiResponse = ref('');
const lineOption = ref({
  title: {
    text: 'Peso por mês',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 12 } },
  grid: { left: 40, right: 20, top: 50, bottom: 60 },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value', name: 'Peso (Kg)' },
  series: []
});

function callApi() {
  fetch('http://localhost:3001/api/testQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      type: 'PCA',
      lota_id: 'all',
      fao: 'all',
      ilha_id: 'all',
      start_date: '2025-01-01',
      final_date: '2025-09-27',
      day_date: ''
    }).toString(),
    credentials: 'include'
  })
    .then(response => response.text())
    .then(data => {
      try {
        const json = JSON.parse(data);
        apiResponse.value = '';
        // Example: group by month, top 3 species
        const speciesMap = {};
        json.forEach(item => {
          const month = '2025-' + String(Math.floor(Math.random() * 9 + 1)).padStart(2, '0'); // EXAMPLE! Replace with real month logic if your data has dates
          if (!speciesMap[item['Espécie']]) speciesMap[item['Espécie']] = {};
          speciesMap[item['Espécie']][month] = (speciesMap[item['Espécie']][month] || 0) + parseFloat(item['Peso (Kg)']);
        });
        const topSpecies = Object.keys(speciesMap).slice(0, 3); // Top 3 species
        const months = Array.from({length: 9}, (_, i) => `2025-${String(i+1).padStart(2, '0')}`);
        lineOption.value.xAxis.data = months;
        lineOption.value.series = topSpecies.map(sp => ({
          name: sp,
          type: 'line',
          data: months.map(m => speciesMap[sp][m] || 0),
          smooth: true
        }));
      } catch {
        apiResponse.value = data;
        lineOption.value.series = [];
      }
    });
}
</script>