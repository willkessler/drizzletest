import { Hono } from 'hono'
import { db } from '../db'
import { vehicles } from '../db/schema'
import { eq, inArray } from 'drizzle-orm'
import { isValidDate } from '../utils/validators'

const vehicleRoutes = new Hono();

vehicleRoutes.get('/getVehicles', async (c) => {
  try {
    const ids = c.req.query('ids')?.split(',').map(Number);
    
    let query = db.select().from(vehicles);
    if (ids?.length) {
      query = query.where(inArray(vehicles.id, ids));
    }
    
    const result = await query;
    const jsonResults = c.json({ success: true, vehicles: result })
    console.log(`Backend got results: ${JSON.stringify(result,null,2)}`);
    return jsonResults;
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch vehicles' }, 500);
  }
})

vehicleRoutes.put('/updateVehicle', async (c) => {
  try {
    const body = await c.req.json();
    const { id, type, size, miles, lastService } = body;

    // Validation
    if (!id || !type || !size || typeof miles !== 'number' || !lastService) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    if (!isValidDate(lastService)) {
      return c.json({ success: false, error: 'Invalid date format. Use MM/DD/YYYY' }, 400);
    }

    const [month, day, year] = lastService.split('/').map(Number);
    const formattedDate = new Date(year, month - 1, day);

    await db.update(vehicles)
      .set({
        type,
        size,
        miles,
        lastService: formattedDate
      })
      .where(eq(vehicles.id, id));

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update vehicle' }, 500);
  }
})

export { vehicleRoutes };

