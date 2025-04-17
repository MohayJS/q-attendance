<script setup lang="ts">
import ApexCharts from 'apexcharts';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from 'src/utils/redirect';

const router = useRouter();

const OverAllAttendance = {
  chart: {
    type: 'area',
    height: 350
  },
  series: [{
    name: 'BS - Information Technology (Database Systems)',
    data: [ 30, 40, 35, 50, 49, 60, 70 ]
  },
  {
    name: 'BS - Information Technology (Networking Systems)',
    data: [ 20, 30, 25, 40, 39, 50, 60 ]
  },
  {
    name: 'BS - Information Systems',
    data: [ 10, 20, 15, 30, 29, 40, 50 ]
  },
  {
    name: 'BS - Computer Science',
    data: [ 5, 10, 8, 15, 14, 20, 25 ]
  }],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
  stroke: {
    curve: 'smooth'
  }
};

const Attendance = {
  chart: {
    type: 'area',
    height: 100,
    sparkline: {
      enabled: true
    }
  },
  series: [{
    name: 'Attendance',
    data: [ 130, 128, 130, 135, 131, 138, 140]
  }],
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#28c76f'],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100]
    }
  },
}

onMounted(() => {
    const chart = new ApexCharts(document.querySelector("#chart"), OverAllAttendance);
    void chart.render()

    const attendance = new ApexCharts(document.querySelector("#attendance"), Attendance);
    void attendance.render()
})

onUnmounted(() => {
    const chart = ApexCharts.getChartByID('chart');
    const attendance = ApexCharts.getChartByID('attendance');
    if (chart) chart.destroy();
    if (attendance) attendance.destroy();
})

function signOff() {
    logout(router);
}

</script>

<template>
  <q-page class="q-pa-md admindashboard">
    <q-card
      class="my-card text-white q-mb-md"
      style="background: radial-gradient(circle, #fffcef 0%, #790622 100%)"
    >
      <q-card-section>
        <h1 class="text-h4">Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </q-card-section>
    </q-card>

    <div style="display: flex; flex-direction: column; gap: 16px;">

      <div class="cardContainer">
        <q-card class="card">
          <q-card-section>
            <div style="display: flex; gap: 1rem;">
              <q-icon class="icon" name="people" color="primary" size="2rem" />
              <div>
                <h4 class="no-margin"><strong>120</strong></h4>
                <p class="no-margin">Total Students</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div style="display: flex; gap: 1rem;">
              <q-icon class="icon" name="today" color="primary" size="2rem" />
              <div>
                <h4 class="no-margin"><strong>20</strong></h4>
                <p class="no-margin">Total Classes</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div style="display: flex; gap: 1rem;">
              <q-icon class="icon" name="check" color="primary" size="2rem" />
              <div>
                <h4 class="no-margin"><strong>450</strong></h4>
                <p class="no-margin">Present</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div style="display: flex; gap: 1rem;">
              <q-icon class="icon" name="clear" color="primary" size="2rem" />
              <div>
                <h4 class="no-margin"><strong>30</strong></h4>
                <p class="no-margin">Absent</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="cardContainer" style="justify-content: space-between;">

        <div id="chart" style="flex: 1.5 1 0; margin: 8px; margin-top: 0;"></div>
        <q-markup-table class="table" style="flex: 1 1 0; margin: 8px; margin-top: 0;">
            <thead>
              <tr>
                <th style="text-align: left; font-size: 2rem;">Recent activity</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monkey D. Luffy</td>
                <td>2 hours ago</td>
                <td>Present</td>
              </tr>
              <tr>
                <td>Roronoa Zoro</td>
                <td>3 hours ago</td>
                <td>Absent</td>
              </tr>
              <tr>
                <td>Nami</td>
                <td>5 hours ago</td>
                <td>Present</td>
              </tr>
              <tr>
                <td>Sanji</td>
                <td>6 hours ago</td>
                <td>Present</td>
              </tr>
              <tr>
                <td>Usopp</td>
                <td>7 hours ago</td>
                <td>Present</td>
              </tr>
            </tbody>
          </q-markup-table>
      </div>
    </div>
    <q-btn color="primary" label="Logout" @click="signOff" />

    <div>
      <router-view />
    </div>
  </q-page>
</template>

<style scoped>
.no-margin{
    margin: 0;
}

#chart {
    background-color: white;
    border-radius: 10px;
    border: solid 0.5px rgb(224, 224, 224);
}

.admindashboard {
    background-color: #f3f3f7;
}

.cardSection > div {
    margin-left: 1rem;
}

.card {
    max-height: auto;
    background-color: white;
    border-radius: 10px;
    border: solid 0.5px rgb(224, 224, 224);
    display: flex;

    p {
      color: #aeb0cc
    }
    flex: 1 1 0; margin: 8px;
}

.cardContainer {
  display: flex; 
  flex-wrap: wrap; 
  flex-direction: row; 
  align-items: stretch;
}

.icon {
    background-color: #ffefe2;
    padding: 1rem;
    border-radius: 50%;
}

.table {
  color: #616161;
  border-radius: 10px;

  td:first-child {
    font-size: 1.2rem;
  }
}
</style>