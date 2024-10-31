<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    submit: Omit<Vehicle, 'id'>;
  }>();
  
  let formData = $state({
    type: 'Truck',
    size: 'Large',
    miles: 1000,
//    lastService: new Date().toLocaleDateString()
  });
  
  let error = $state('');
  
  // Validation function
  function validateForm(): boolean {
    if (!formData.type) {
      error = 'Type is required';
      return false;
    }
    if (!formData.size) {
      error = 'Size is required';
      return false;
    }
    if (formData.miles < 0) {
      error = 'Miles cannot be negative';
      return false;
    }
/*
    if (!formData.lastService) {
      error = 'Last service date is required';
      return false;
    }
*/    
    error = '';
    return true;
  }
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    formData.lastService = '06/03/1965';
    if (validateForm()) {
      dispatch('submit', formData);
      
      // Reset form
      formData = {
        type: '',
        size: '',
        miles: 0,
        lastService: new Date().toLocaleDateString()
      };
    }
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="text-red-500">{error}</div>
  {/if}
  
  <div class="form-group">
    <label for="type">Vehicle Type</label>
    <input
      id="type"
      type="text"
      bind:value={formData.type}
      placeholder="e.g., Truck, Van, Car"
      class="input"
    />
  </div>
  
  <div class="form-group">
    <label for="size">Size</label>
    <select id="size" bind:value={formData.size} class="input">
      <option value="">Select size...</option>
      <option value="Small">Small</option>
      <option value="Medium">Medium</option>
      <option value="Large">Large</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="miles">Miles</label>
    <input
      id="miles"
      type="number"
      bind:value={formData.miles}
      min="0"
      class="input"
    />
  </div>
  
  <div class="form-group">
    <label for="lastService">Last Service Date</label>
    <input
      id="lastService"
      type="date"
      bind:value={formData.lastService}
      class="input"
    />
  </div>
  
  <button type="submit" class="submit-button">
    Add Vehicle
  </button>
</form>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    width: 100%;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    width: 100%;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
</style>
