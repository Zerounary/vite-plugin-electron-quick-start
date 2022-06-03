<template>
  <div>
    <router-link to="/pos/home">/pos/home</router-link>
  </div>
</template>

<script setup lang="ts">
import { db } from '~/electron-main/common/db';

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
</script>

<style scoped>

</style>