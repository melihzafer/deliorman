import { z } from "zod";

// Strict Bulgarian Phone Regex:
// Matches +35987... or 087... (standard BG mobile prefixes)
const BG_PHONE_REGEX = /^(?:\+359|0)8[789]\d{7}$/;

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Името трябва да е поне 2 символа"),
  phone: z.string()
    .regex(BG_PHONE_REGEX, "Моля, въведете валиден български мобилен номер (напр. 0888123456)"),
  address: z.string().min(10, "Моля, предоставете пълен адрес за доставка"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"]),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string().optional(),
  })).min(1, "Количката е празна"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
