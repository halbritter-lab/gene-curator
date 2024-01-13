<!-- views/UserAdminView.vue -->
<template>
  <v-container>
    <h1>User Administration</h1>
    <DataDisplayTable
      :headers="headers"
      :items="paginatedUsers"
      :config="tableConfig"
      :total-items="totalUsers"
      :loading="loading"
    >
      <!-- Role slot for role selection -->
      <template v-slot:role-slot="{ item }">
        <v-select
          :items="['admin', 'curator', 'viewer']"
          v-model="item.role"
          @change="updateUserRole(item)"
          dense
        ></v-select>
      </template>
    </DataDisplayTable>

  </v-container>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import DataDisplayTable from '@/components/DataDisplayTable.vue';
import { getUsers } from '@/stores/usersStore';

export default {
  name: 'UserAdminView',
  components: {
    DataDisplayTable
  },
  setup() {
    const users = ref({});
    const loading = ref(false);
    const page = ref(1);
    const itemsPerPage = ref(10);

    // Fetch users from Firestore
    onMounted(async () => {
      loading.value = true;
      users.value = await getUsers();
      loading.value = false;
    });

    const totalUsers = computed(() => Object.keys(users.value).length);

    const paginatedUsers = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return Object.values(users.value).slice(start, end);
    });

    const headers = [
    { title: 'User Name', value: 'name' },
    { title: 'Email', value: 'email' },
    { title: 'Created Date', value: 'createdAt' },
    { title: 'Role', value: 'role' }
    ];

    const tableConfig = {
    columns: [
        {
        name: 'name',
        type: 'text'
        },
        {
        name: 'email',
        type: 'text'
        },
        {
        name: 'createdAt',
        type: 'text',
        // Additional formatting for the date can be added here
        },
        {
        name: 'role',
        type: 'slot',
        slotName: 'role-slot'
        }
    ]
    };

    // TODO: Implement logic to assign roles

    return {
      users,
      loading,
      headers,
      paginatedUsers,
      totalUsers,
      tableConfig
    };
  },
};
</script>
