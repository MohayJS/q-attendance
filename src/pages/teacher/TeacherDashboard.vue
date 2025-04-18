<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SessionStorage } from 'quasar';

const router = useRouter();

// Checking if there are user credentials in session storage
const auth = SessionStorage.getItem('CURRENT_USER');
if (!auth) {
    void router.push('/');
}

function logout() {
    SessionStorage.remove('CURRENT_USER');
    void router.push('/');
}
</script>

<template>
  <q-page>


    
    <div style="background-color: #4CAF50; text-align: center; padding: 10px;">

      <!-- Teacher Dashboard Display -->
  <h1 style="font-size: 36px; font-weight: bold; color: white;">Class Schedules</h1>
</div>
  
    
   
<!-- Teacher Dashboard Display -->
    <p style="font-size: 24px; text-align: center;">Teacher: John Doe</p>
    
     <q-card-section class="text-h6"></q-card-section>
     <q-card-section class="text-h6"></q-card-section>


        <!-- class table panels-->

     <h2 style="font-size: 28px; font-weight: bold;">Today's Classes Panel</h2>
  <table border="0" style="margin: 20px auto; border-collapse: collapse; width: 80%; text-align: center; background-color: #f9f9f9;">
    <thead>
      <tr style="background-color: #388E3C; color: white;">
        <th style="padding: 12px;">Subject</th>
        <th style="padding: 12px;">Time</th>
        <th style="padding: 12px;">Class/Section</th>
        <th style="padding: 12px;">Location/Online Link</th>
        <th style="padding: 12px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px;">Mathematics</td>
        <td style="padding: 10px;">10:00 AM</td>
        <td style="padding: 10px;">Math 101</td>
        <td style="padding: 10px;">Room 204</td>
        <td style="padding: 10px;">Upcoming</td>
      </tr>
      <tr style="background-color: #ffffff;">
        <td style="padding: 10px;">English</td>
        <td style="padding: 10px;">12:00 PM</td>
        <td style="padding: 10px;">Eng 201</td>
        <td style="padding: 10px;">Room 101</td>
        <td style="padding: 10px;">In Progress</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px;">Physics</td>
        <td style="padding: 10px;">2:00 PM</td>
        <td style="padding: 10px;">Phys 301</td>
        <td style="padding: 10px;">Online (Zoom)</td>
        <td style="padding: 10px;">Done</td>
      </tr>
    </tbody>
  </table>



     <!-- Logout Button -->
    <q-btn color="primary" @click="logout">Log out</q-btn>
      
    
    <div>
      <router-view />
    </div>
  </q-page>
</template>