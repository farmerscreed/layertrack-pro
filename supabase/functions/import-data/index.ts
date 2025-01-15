import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, type } = await req.json()
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] ?? '')
    
    if (!user) {
      throw new Error('Unauthorized')
    }

    let result
    switch (type) {
      case 'batches':
        result = await Promise.all(
          data.map(async (row: any) => {
            const { data, error } = await supabase
              .from('batches')
              .insert({
                user_id: user.id,
                name: row.name,
                breed: row.breed,
                quantity: parseInt(row.quantity),
                arrival_date: row.arrival_date,
                notes: row.notes,
                status: row.status || 'active'
              })
              .select()
            
            if (error) throw error
            return data
          })
        )
        break

      case 'feed_inventory':
        result = await Promise.all(
          data.map(async (row: any) => {
            const { data, error } = await supabase
              .from('feed_inventory')
              .insert({
                user_id: user.id,
                feed_type: row.feed_type,
                quantity_kg: parseFloat(row.quantity_kg),
                purchase_date: row.purchase_date,
                cost_per_kg: parseFloat(row.cost_per_kg),
                supplier: row.supplier,
                notes: row.notes
              })
              .select()
            
            if (error) throw error
            return data
          })
        )
        break

      // Add more cases for other data types

      default:
        throw new Error('Invalid import type')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})