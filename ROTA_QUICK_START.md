# Rota & Timesheets Module - Quick Start Guide

## 5-Minute Setup

### Step 1: Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

Get these from your Supabase project dashboard.

### Step 2: Install Dependencies

```bash
npm install
```

This installs `@supabase/supabase-js` (already in package.json).

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Step 4: Access the Rota Module

1. Login as a business owner or manager
2. Navigate to: http://localhost:3000/rota
3. System auto-creates 4 sample staff members on first load

## Creating Your First Shift (30 seconds)

1. **Drag staff** from right sidebar (e.g., "Ben")
2. **Drop onto grid** (e.g., Monday 09:00 cell)
3. **Modal opens** with smart defaults:
   - Start: 09:00
   - End: 17:00 (8 hours)
   - Break: 30 minutes
   - Role: "Barista" (from Ben's profile)
4. **Click "Create Shift"**
5. **See shift appear** as green block on grid
6. **Check totals** in top-right: "7.5h" and "£93.75"

## Publishing the Rota

1. Click **"Publish Rota"** button (gold, top-right)
2. Confirmation modal appears
3. Click **"Publish & Notify"**
4. All draft shifts become published
5. Success message shows notification sent

## Testing Timesheets

### Quick Test with Seed Data

```bash
curl -X POST http://localhost:3000/api/rota/seed-timesheets \
  -H "Content-Type: application/json" \
  -d '{"businessId":"default"}'
```

This creates sample timesheets for published shifts.

### Manual Test

1. Switch to **"Timesheets"** tab
2. View submitted timesheets
3. Find one with **"Requires Review"** (amber badge)
4. Click **"Review"** button
5. Modal shows variance details
6. Try actions:
   - **Approve as Submitted**
   - **Amend hours** and approve
   - **Reject**

## Exporting Data

Click **"Export CSV"** button in Timesheets tab to download all timesheet data.

## Database Verification

Check your Supabase dashboard to see:
- **staff** table: 4 sample employees
- **shifts** table: Your created shifts
- **timesheets** table: Submitted timesheets

## Troubleshooting

### "Loading rota system..." forever
- Check Supabase URL and key in `.env.local`
- Verify Supabase project is running
- Check browser console for errors

### No staff appearing
- Refresh page (auto-creates sample data)
- Check Supabase dashboard → staff table
- Verify businessId = "default"

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Customize staff**: Add your real employees
2. **Build a week**: Create shifts for all 7 days
3. **Test workflow**: Create → Publish → Submit → Review
4. **Export data**: Try CSV export
5. **Read docs**: See `ROTA_MODULE_README.md` for full details

## Key Features to Explore

- **Drag-and-drop**: Fastest way to create shifts
- **Click-to-edit**: Click any shift to modify
- **Real-time cost**: Watch totals update as you add shifts
- **Week navigation**: Previous/Next week buttons
- **Auto-approval**: 15-minute tolerance for timesheets
- **Color coding**: Each staff member has unique color

## Production Deployment

1. Add Supabase credentials to Vercel environment variables
2. Deploy: `vercel --prod`
3. System works immediately with real data

## Support

- Full documentation: `ROTA_MODULE_README.md`
- Implementation details: `ROTA_IMPLEMENTATION_SUMMARY.md`
- Issues: Check browser console and Supabase logs

---

**You're ready to build rotas!** The system is production-ready and fully functional.
