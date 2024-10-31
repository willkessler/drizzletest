<script lang="ts">
 import { onMount, onDestroy } from 'svelte';
 import VehicleForm from './VehicleForm.svelte';

 let vehicles = $state([]);
 let isLoading = $state(true);
 let error = $state(null);
 let pollingInterval = $state(10000);
 let showForm = $state(false);

 let { selectedIds = [] } = $props();
 
 interface Vehicle {
   id: number;
   type: string;
   size: string;
   miles: number;
   lastService: string;
 }

 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function createVehicle(vehicleData: Omit<Vehicle, 'id'>) {
   error = null;
   try {
     const response = await fetch(`${API_URL}/api/createVehicle`, {
       method: 'POST',
       credentials: 'include', // Add credentials
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
       },
       body: JSON.stringify(vehicleData),
     });
     
     const data = await response.json();
     
     if (data.success) {
       showForm = false;
       await fetchVehicles();
     } else {
       error = data.error || 'Failed to create vehicle';
     }
   } catch (e) {
     error = 'Failed to create vehicle';
     console.error(e);
   }
 }

 // You might also want to update the GET request to match:
 async function fetchVehicles() {
   isLoading = true;
   error = null;
   try {
     const queryParams = selectedIds.length ? `?ids=${selectedIds.join(',')}` : '';
     const response = await fetch(`${API_URL}/api/getVehicles${queryParams}`, {
       credentials: 'include',
       headers: {
         'Accept': 'application/json',
       }
     });
     const data = await response.json();
     
     if (data.success) {
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
   fetchVehicles();
   pollingInterval = setInterval(fetchVehicles, pollingInterval);
 }

 onMount(() => {
   startPolling();
 });

 onDestroy(() => {
   if (pollingInterval) {
     clearInterval(pollingInterval);
   }
 });

 $effect(() => {
   if (selectedIds) {
     fetchVehicles();
   }
 });

 function handleVehicleSubmit(event: CustomEvent<Omit<Vehicle, 'id'>>) {
   createVehicle(event.detail);
 }
</script>

<div class="container">
  <div class="header">
    <h2>Vehicles</h2>
    <button 
      class="add-button" 
      on:click={() => showForm = !showForm}
    >
      {showForm ? 'Cancel' : 'Add Vehicle'}
    </button>
  </div>

  {#if showForm}
    <div class="form-container">
      <VehicleForm on:submit={handleVehicleSubmit} />
    </div>
  {/if}

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
</div>

<style>
  .container {
    padding: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .add-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .add-button:hover {
    background-color: #45a049;
  }

  .form-container {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
  }

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
    margin-bottom: 1rem;
  }
</style>
