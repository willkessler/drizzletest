<script lang="ts">
 import { onMount, onDestroy } from 'svelte';

 let vehicles = $state([]);
 let isLoading = $state(true);
 let error = $state(null);
 let pollingInterval = $state(10000);

 let { selectedIds = [] } = $props();
 
 interface Vehicle {
   id: number;
   type: string;
   size: string;
   miles: number;
   lastService: string;
 }

 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

 async function fetchVehicles() {
   isLoading = true;
   error = null;
   try {
     const queryParams = selectedIds.length ? `?ids=${selectedIds.join(',')}` : '';
     const response = await fetch(`${API_URL}/api/getVehicles${queryParams}`);
     const data = await response.json();
     
     if (data.success) {
       console.log(`fetched data from ${import.meta.env.VITE_API_URL}:`, vehicles);
       vehicles = data.vehicles;
     } else {
       error = data.error;
     }
   } catch (e) {
     error = 'Failed to fetch vehicles';
     console.error(e);
   } finally {
     isLoading = false;
   }
 }

 function startPolling() {
   // Initial fetch
   fetchVehicles();
   
   // Set up polling every 30 seconds
   pollingInterval = setInterval(fetchVehicles, pollingInterval);
 }

 onMount(() => {
   startPolling();
 });

 onDestroy(() => {
   // Clean up interval when component unmounts
   if (pollingInterval) {
     clearInterval(pollingInterval);
   }
 });

 $effect(() => {
   if (selectedIds) {
     fetchVehicles();
   }
 });
</script>

{#if error}
  <div class="error">Error: {error}</div>
{/if}

{#if isLoading && !vehicles.length}
  <div>Loading vehicles...</div>
{:else}

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Size</th>
        <th>Miles</th>
        <th>Last Service</th>
      </tr>
    </thead>
    <tbody>
      {#each vehicles as vehicle}
        <tr>
          <td>{vehicle.id}</td>
          <td>{vehicle.type}</td>
          <td>{vehicle.size}</td>
          <td>{vehicle.miles.toLocaleString()}</td>
          <td>{new Date(vehicle.lastService).toLocaleDateString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    padding: 0.5rem;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
  }

  .error {
    color: red;
  }
</style>
