# API Endpoints Documentation

This document describes the available API endpoints for the Deliorman Restaurant application.

## Base URL
All API endpoints are relative to `/api/`

## Endpoints

### 1. Menu Endpoint
**GET** `/api/menu`

Retrieves the complete restaurant menu with all categories and items.

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurant_name": "Делиорман",
    "categories": [...]
  }
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 2. Reservation Endpoint
**POST** `/api/reservation`

Creates a new table reservation request.

**Request Body (FormData):**
- `first_name` (required): Guest's first name (min 2 characters)
- `last_name` (required): Guest's last name (min 2 characters)
- `email` (required): Valid email address
- `person` (required): Number of guests
- `date` (required): Reservation date (cannot be in the past)
- `time` (required): Reservation time
- `message` (optional): Additional notes

**Response:**
```json
{
  "success": true,
  "message": "Благодарим за вашата резервация! Ще получите потвърждение скоро."
}
```

**Error Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Невалиден имейл адрес"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Validation error
- `500`: Server error

---

### 3. Contact Endpoint
**POST** `/api/contact`

Submits a contact form message.

**Request Body (FormData):**
- `first_name` (required): Sender's first name (min 2 characters)
- `last_name` (required): Sender's last name (min 2 characters)
- `email` (required): Valid email address
- `phone` (required): Phone number (min 9 characters)
- `message` (required): Message content (min 10 characters)

**Response:**
```json
{
  "success": true,
  "message": "Благодарим за вашето съобщение! Ще се свържем с вас скоро."
}
```

**Error Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "message",
      "message": "Съобщението трябва да е поне 10 символа"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Validation error
- `500`: Server error

---

## Environment Variables

The following environment variables are required:

- `RESEND_API_KEY`: API key for Resend email service (used for reservation and contact notifications)

## Email Integration

The application uses the Resend service to send email notifications to the restaurant email address (`restaurantdeliorman@gmail.com`) when:
- A new reservation is made
- A contact form is submitted

Make sure to configure the `RESEND_API_KEY` in your environment variables.

## Future Enhancements

Possible future API endpoints could include:
- `/api/specialties` - Get featured specialty dishes
- `/api/gallery` - Get restaurant images
- `/api/menu/category/:slug` - Get menu items by category
