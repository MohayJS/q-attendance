<script setup lang="ts">
import ApexCharts from 'apexcharts';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from 'src/utils/redirect';

const router = useRouter();

function signOff() {
    logout(router);
}

const OverAllAttendance = {
  chart: {
    type: 'area',
    height: 400
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

</script>

<template>
  <q-page class="q-pa-md admindashboard">
    <q-card
      class="my-card text-white q-mb-md"
      style="background: radial-gradient(circle, #fffcef 0%, #790622 100%)"
    >
      <q-card-section>
        <h1 class="text-h4">Supervisor Dashboard</h1>
      </q-card-section>
    </q-card>

    <div class="row q-gutter-md">
      <div class="row col q-gutter-md">
        <div class="col-3 container ">
          <q-card class="card">
                <q-card-section class="cardSection">
                  <div style="display: flex;">
                    <q-icon class="icon" name="people" color="primary" size="2rem" />
                    <div>
                      <h4 class="no-margin"><strong>120</strong></h4>
                      <p class="no-margin">Students</p>
                    </div>
                  </div>
                </q-card-section>
            </q-card>

            <q-card class="card" style="display: grid;">
              <q-card-section class="cardSection">
                <div>
                  <div style="display: flex;">
                    <q-icon class="icon" name="check" color="primary" size="2rem" />
                    <div>
                      <h4 class="no-margin"><strong>85%</strong></h4>
                      <p class="no-margin">Attendance</p>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <div id="attendance" class="attendance-chart"></div>
            </q-card>
        </div>

          <div id="chart" class="col flex"></div>
      </div>

      <div class="col-12 row">
        <q-markup-table class="table row col-4">
          <thead>
            <tr>
              <th style="text-align: left; font-size: 1.5rem;">Faculty Overview</th>
              <th>Courses</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. John Smith</td>
              <td>5</td>
              <td>150</td>
            </tr>
            <tr>
              <td>Prof. Jane Doe</td>
              <td>4</td>
              <td>120</td>
            </tr>
            <tr>
              <td>Dr. Robert Brown</td>
              <td>6</td>
              <td>180</td>
            </tr>
            <tr>
              <td>Prof. Emily White</td>
              <td>3</td>
              <td>90</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <q-btn color="primary" @click="signOff">Logout</q-btn>
    <div>
      <router-view />
    </div>
  </q-page>
</template>

<style scoped>
.no-margin{
    margin: 0;
}

.container {
  display: grid;
  gap: 16px;
}
#chart {
    background-color: white;
    border-radius: 10px;
    border: solid 0.5px rgb(224, 224, 224);
}

.admindashboard {
    background-color: #f3f3f7;
}

.cardSection {
    display: flex;
    align-items: center;
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
}

.icon {
    background-color: #ffefe2;
    padding: 1rem;
    border-radius: 50%;
}
</style>