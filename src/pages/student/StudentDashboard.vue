<script setup lang="ts">
import ApexCharts from 'apexcharts';
import { onMounted, onUnmounted } from 'vue';
import { logout } from 'src/utils/redirect';

const AttendanceTrend = {
  chart: {
    type: 'line',
    height: 280,
    toolbar: { show: false },
  },
  series: [
    {
      name: 'Attendance Rate',
      data: [85, 88, 92, 90, 95, 93, 96],
    },
  ],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  colors: ['#7367F0'],
  stroke: { width: 2, curve: 'smooth' },
};

const CurrentSchedule = {
  chart: {
    type: 'bar',
    height: 200,
    stacked: true,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 5,
    },
  },
  series: [
    {
      name: 'Classes',
      data: [3, 2, 3, 2, 4, 4, 1],
    },
  ],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  },
  colors: ['#00E396'],
};

onMounted(() => {
  const attendanceChart = new ApexCharts(
    document.querySelector('#attendance-trend'),
    AttendanceTrend,
  );
  const scheduleChart = new ApexCharts(
    document.querySelector('#current-schedule'),
    CurrentSchedule,
  );
  void attendanceChart.render();
  void scheduleChart.render();
});

onUnmounted(() => {
  const attendanceChart = ApexCharts.getChartByID('attendance-trend');
  const scheduleChart = ApexCharts.getChartByID('current-schedule');
  if (attendanceChart) attendanceChart.destroy();
  if (scheduleChart) scheduleChart.destroy();
});

function signOff() {
  logout();
}
</script>

<template>
  <q-page class="q-pa-md student-dashboard">
    <div class="header">
      <h1 class="page-title">Student Dashboard</h1>
      <q-btn color="primary" @click="signOff" class="logout-btn">Logout</q-btn>
    </div>

    <div class="row">
      <div class="col-12 row" style="margin-bottom: 1rem">
        <div class="grid col-3 cardContainer">
          <q-card class="col-2 card">
            <q-card-section>
              <div class="metric-item">
                <q-icon name="today" color="primary" size="2rem" />
                <div>
                  <h2 class="no-margin">3</h2>
                  <p class="metric-label">Classes Today</p>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="col-2 card">
            <q-card-section>
              <div class="metric-item">
                <q-icon name="check_circle" color="primary" size="2rem" />
                <div>
                  <h2 class="no-margin">94%</h2>
                  <p class="metric-label">Attendance</p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div id="attendance-trend" class="col chart-card" style="margin-left: 1rem"></div>
      </div>

      <div class="col-12 row">
        <div id="current-schedule" class="chart-card col" style="margin-right: 1rem"></div>
        <q-markup-table class="schedule-table col-4">
          <thead>
            <tr>
              <th class="text-left">Time</th>
              <th class="text-left">Course</th>
              <th class="text-left">Room</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>08:00 - 09:30</td>
              <td>Database Systems</td>
              <td>Room 301</td>
              <td><q-icon name="check" color="positive" /> Present</td>
            </tr>
            <tr>
              <td>10:00 - 11:30</td>
              <td>Network Fundamentals</td>
              <td>Lab B</td>
              <td><q-icon name="schedule" color="warning" /> Upcoming</td>
            </tr>
            <tr>
              <td>13:00 - 14:30</td>
              <td>Web Development</td>
              <td>Room 215</td>
              <td><q-icon name="schedule" color="warning" /> Upcoming</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div class="schedule-section"></div>
    </div>

    <div>
      <router-view />
    </div>
  </q-page>
</template>

<style scoped>
.student-dashboard {
  background-color: #f8f9fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  margin: 0;
}

.cardContainer {
  display: grid;
  gap: 16px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-item h2 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.metric-label {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.chart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.schedule-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.schedule-table th {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
}

.schedule-table td {
  color: #34495e;
}

.logout-btn {
  align-self: flex-start;
}
</style>
