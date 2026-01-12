# Step-by-Step Address Form Documentation

## Overview

This document describes the new `StepByStepAddressForm` component - a progressive address selection form that guides users through choosing their delivery address in stages.

## Component Structure

### Files Created

1. **`/src/components/StepByStepAddressForm.tsx`** - Main component
2. **`/src/components/StepByStepAddressForm.css`** - Component styles
3. **`/src/types/stepByStepForm.types.ts`** - TypeScript type definitions
4. **`/src/vite-env.d.ts`** - Environment variables type definitions

### Files Modified

1. **`/src/App.tsx`** - Updated to use the new component
2. **`/src/services/api.ts`** - Added `sendStepByStepAddressData` function
3. **`/src/types/dadata.types.ts`** - Fixed type imports

## Form Fields (in order)

### 1. City (Город) - Required
- **Type:** DaData autocomplete
- **Filter:** `filterFromBound="city"`, `filterToBound="city"`
- **Behavior:** First field, always enabled
- **Saves:** city_fias_id or settlement_fias_id for filtering

### 2. Street (Улица) - Required
- **Type:** DaData autocomplete
- **Filter:** `filterFromBound="street"`, `filterToBound="street"`, `filterLocations=[{city_fias_id}]`
- **Behavior:** Enabled after city selection
- **Saves:** street_fias_id for filtering

### 3. House (Дом) - Required
- **Type:** DaData autocomplete
- **Filter:** `filterFromBound="house"`, `filterToBound="house"`, `filterLocations=[{street_fias_id}]`
- **Behavior:** Enabled after street selection

### 4. Building/Corpus (Корпус/строение) - Optional
- **Type:** Text input
- **Behavior:** Enabled after house selection

### 5. Apartment/Office (Квартира/офис) - Required
- **Type:** Text input
- **Behavior:** Enabled after house selection
- **Validation:** Required field

### 6. Entrance (Подъезд) - Optional
- **Type:** Text input
- **Behavior:** Enabled after house selection

### 7. Floor (Этаж) - Optional
- **Type:** Text input
- **Behavior:** Enabled after house selection

### 8. Courier Comment (Комментарий для курьера) - Optional
- **Type:** Textarea (3 rows)
- **Behavior:** Enabled after house selection
- **Example:** "позвоните за 15 минут, домофон не работает"

### 9. Delivery Conditions (Особые условия доставки) - Optional
- **Type:** Textarea (3 rows)
- **Behavior:** Enabled after house selection
- **Example:** "код домофона 123, нужен пропуск на охране"

## Progressive Field Enablement

The form uses a step-by-step approach with visual feedback:

```typescript
const canEnableStreet = !!formData.city_fias_id;
const canEnableHouse = !!formData.street_fias_id;
const canEnableOtherFields = !!formData.house;
```

## Progress Indicator

A visual step indicator shows progress through 4 main stages:
1. City selection
2. Street selection
3. House selection
4. Additional details

States:
- **Active** - Current step (purple highlight)
- **Completed** - Step finished (green checkmark)
- **Inactive** - Future step (gray)

## Data Sent to Webhook

The form sends a `StepByStepWebhookPayload` with the following structure:

```typescript
{
  user_id?: string;           // From query params
  session_id?: string;        // From query params

  // DaData suggestions (full objects)
  city: DaDataSuggestion<DaDataAddress>;
  street: DaDataSuggestion<DaDataAddress>;
  house: DaDataSuggestion<DaDataAddress>;

  // Additional fields
  building: string;           // Корпус
  apartment: string;          // Квартира (required)
  entrance: string;           // Подъезд
  floor: string;              // Этаж
  courierComment: string;     // Комментарий для курьера
  deliveryConditions: string; // Особые условия доставки

  // Metadata
  timestamp: string;          // ISO timestamp
  source: "step_by_step_address_form";
  fullAddress: string;        // Human-readable full address
}
```

## DaData Filtering Configuration

### City Selection
```typescript
filterFromBound="city"
filterToBound="city"
```

### Street Selection
```typescript
filterFromBound="street"
filterToBound="street"
filterLocations={[{ city_fias_id: formData.city_fias_id }]}
```

### House Selection
```typescript
filterFromBound="house"
filterToBound="house"
filterLocations={[{ street_fias_id: formData.street_fias_id }]}
```

## Validation Rules

1. **City** - Must be selected from DaData suggestions
2. **Street** - Must be selected from DaData suggestions
3. **House** - Must be selected from DaData suggestions
4. **Apartment** - Required text field (must not be empty)
5. All other fields - Optional

The submit button is disabled until:
- City, Street, and House are selected
- Form is not currently submitting

## Address Preview

When all required fields are filled, a preview box shows:
- Full selected address
- Building/apartment details
- Entrance/floor if provided
- Courier comment if provided
- Delivery conditions if provided

## Styling Features

- **Progress indicator** with step numbers and labels
- **Disabled field states** with reduced opacity
- **Additional fields section** with dashed border
- **Address preview** with gradient background
- **Responsive design** for mobile devices
- **Smooth transitions** for state changes
- **Focus states** with purple highlight

## Usage in App

Update `/src/App.tsx`:

```typescript
import { StepByStepAddressForm } from './components/StepByStepAddressForm';

function App() {
  return (
    <div className="app">
      <StepByStepAddressForm />
    </div>
  );
}
```

## Environment Variables Required

Same as the original form:

```env
VITE_DADATA_TOKEN=your_dadata_token_here
VITE_WEBHOOK_URL=your_webhook_url_here
```

## Query Parameters

The form reads these query parameters automatically:
- `user_id` - User identifier
- `session_id` - Session identifier

Example URL:
```
http://localhost:5173/?user_id=123&session_id=abc-xyz
```

## Differences from Original AddressForm

| Feature | Original Form | Step-by-Step Form |
|---------|--------------|-------------------|
| Fields | 1 autocomplete field | 9 fields (3 autocomplete + 6 manual) |
| Validation | Single address required | City/Street/House/Apartment required |
| User Experience | Free-form address | Guided step-by-step |
| Data Granularity | Single address string | Structured address components |
| Progressive Disclosure | No | Yes - fields enable progressively |
| Visual Progress | No | Yes - step indicator |
| Additional Details | Limited | Extensive (entrance, floor, comments) |

## Testing the Form

1. Start the dev server:
```bash
npm run dev
```

2. Open browser with query params:
```
http://localhost:5173/?user_id=test123&session_id=session456
```

3. Test the progressive flow:
   - Select a city → street field enables
   - Select a street → house field enables
   - Select a house → all other fields enable
   - Fill apartment field (required)
   - Submit form

4. Check console for webhook payload

## Accessibility Features

- Proper label associations with `htmlFor`
- Required field indicators (`*`)
- Help text for each field
- Disabled state for unavailable fields
- Keyboard navigation support
- Focus states for inputs
- Semantic HTML structure

## Browser Compatibility

- Modern browsers with ES6+ support
- React 18.2+
- Vite 5.0+
- TypeScript 5.2+

## Future Enhancements

Possible improvements:
1. Save form state to localStorage
2. Add address validation against delivery zones
3. Map preview of selected address
4. Autocomplete for building/apartment based on house data
5. Support for multiple address types (home/work/other)
6. Address history for returning users
