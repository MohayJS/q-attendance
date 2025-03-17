<template>
  <q-page>
    <q-toolbar>
      <q-badge>11/20</q-badge>
      <q-toolbar-title>CSC181</q-toolbar-title>
      <q-badge color="secondary">11/20</q-badge>
      <q-chip icon="event">11/20</q-chip>
    </q-toolbar>
    <q-card class="column" style="height: 500px">
      <q-card-section class="col"> </q-card-section>
      <q-card-section class="text-center">
        <q-avatar size="100px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div>Name</div>
      </q-card-section>
      <q-card-actions class="q-gutter-lg" align="evenly">
        <q-btn>Call Later</q-btn>
        <q-btn>Absent</q-btn>
      </q-card-actions>
      <q-card-section class="col">
        <q-btn color="primary" class="full-width">Next</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>
